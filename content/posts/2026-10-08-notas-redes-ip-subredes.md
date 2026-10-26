---
title_es: Notas de clase — redes: direcciones IP y subredes
title_en: Class notes — networking: IP addresses and subnets
date: 2026-10-08
tags: redes, telecom
---

Apuntes rápidos de la última unidad de redes. Principalmente para no olvidarlo antes del examen.

## Dirección IP

Una dirección IPv4 son **32 bits** repartidos en 4 octetos: `192.168.1.10`. La máscara de red indica qué parte identifica la red y qué parte el host.

| Clase | Rango | Uso típico |
|-------|-------|------------|
| A | 1 – 126 | Redes grandes |
| B | 128 – 191 | Redes medianas |
| C | 192 – 223 | Redes pequeñas |

> El 127 está reservado para *loopback* (`127.0.0.1`) y las redes privadas son 10.x, 172.16–31.x y 192.168.x.

## CIDR de memoria

- `/24` = 254 hosts útiles (la clásica doméstica)
- `/25` = 126 hosts
- `/30` = 2 hosts — enlaces punto a punto

## Diferencia entre un switch y un router

El **switch** trabaja en capa 2 (MAC) y segmenta dominios de colisión. El **router** trabaja en capa 3 (IP) y conecta redes distintas, tomando decisiones con tablas de enrutamiento.

Siguiente tema: **VLANs y trunking**.
