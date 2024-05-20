--- 
# cette page fait une bidouille dans des directives frontmatter 
# pour rediriger l'URL / vers /fr
pagination:
  data: redirects
  size: 1
  alias: redirect
redirects:
  - {"from": "/", "to": "/fr/index.html"}
permalink: "index.html"
layout: redirect.njk
---
