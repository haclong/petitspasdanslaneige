--- 
# cette page fait une bidouille dans des directives frontmatter 
# pour rediriger l'URL / vers /fr
pagination:
  data: redirects
  size: 1
  alias: redirect
redirects:
  - {"from": "/fr/index.html", "to": "/fr/0/index.html"}
permalink: fr/index.html
layout: redirect.njk
---
