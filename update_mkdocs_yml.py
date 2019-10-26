#!/usr/bin/env python3
import requests
import sys
import yaml

if len(sys.argv) < 3:
    print("Missing required arguments to update_mkdocs_yml.py.\n")
    print("Usage:\n")
    print("  update_mkdocs_yml.py <SITE_URL> <DOCS_DIR>\n")
    exit(1)

site_url = sys.argv[1]
docs_dir = sys.argv[2]

with open("mkdocs.yml") as f:
    mkdocs = yaml.load(f, Loader=yaml.SafeLoader)

mkdocs["site_url"] = site_url
mkdocs["edit_uri"] = 'edit/master/{}/'.format(docs_dir)
mkdocs["markdown_extensions"] = [
        {
            "markdown.extensions.codehilite": {
                "use_pygments": False
            }
        },
        "pymdownx.superfences",
        {
            "markdown_fenced_code_tabs": {
                "template": "bootstrap3"
            }
        },
        {
            "toc": {
                "toc_depth": 2
            }
        }
    ]

mkdocs["theme"] = {
        "name": None,
        "custom_dir": "zf-mkdoc-theme/theme",
        "static_templates": [
            "404.html"
        ]
    }

with open("zf-mkdoc-theme/assets.yml") as f:
    assets = yaml.load(f, Loader=yaml.SafeLoader)

if "extra" not in mkdocs.keys():
    mkdocs["extra"] = assets
else:
    for key in assets.keys():
        mkdocs["extra"][key] = assets[key]

# Is documentation overview?
if SITE_URL == "https://docs.zendframework.com/"\
        or SITE_URL == "https://docs.zendframework.com":
    # Fetch component list
    url = "https://docs.zendframework.com/zf-mkdoc-theme/scripts/zf-component-list.json"
    res = requests.get(url)
    res.raise_for_status()
    packages = res.json()

    # Fetch groups
    url = 'https://docs.zendframework.com/zf-mkdoc-theme/scripts/zf-component-groups.json'
    res = requests.get(url)
    res.raise_for_status()
    groups = res.json()

    # Sort groups
    groups = sorted(groups, key=lambda item: item['sort'])

    # Prepare dictionary for groups with packages
    packagesInGroups = {}
    for group in groups:
        packagesInGroups.update(
            {
                group['key']: {
                    'group_name': group['name'],
                    'packages': []
                }
            }
        )

    # Add packages to groups
    for package in packages:
        if package['group'] not in packagesInGroups.keys():
            package['group'] = 'components'

        packagesInGroups[package['group']]['packages'].append(
            {
                'name': package['name'],
                'package': package['package'],
                'url': package['url'],
                'description': package['description'],
            }
        )

    # Add component list to MkDocs config
    mkdocs["extra"]["component_list"] = yaml.dump(
        list(packagesInGroups.values()), default_flow_style=True
    )

with open("mkdocs.yml", "w") as f:
    yaml.dump(mkdocs, f, default_flow_style=False)
