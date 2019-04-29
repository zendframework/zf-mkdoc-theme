#!/usr/bin/env python3
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
        {
            "markdown_fenced_code_tabs": {
                "template": "bootstrap3"
            }
        },
        "pymdownx.superfences"
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

with open("mkdocs.yml", "w") as f:
    yaml.dump(mkdocs, f, default_flow_style=False)
