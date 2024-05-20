--- 
# cette page fait une bidouille dans des directives frontmatter 
# pour rediriger l'URL / vers /en
pagination:
  data: redirects
  size: 1
  alias: redirect
redirects:
  - {"from": "/en/index.html", "to": "/en/0/index.html"}
permalink: en/index.html
layout: redirect.njk
---
