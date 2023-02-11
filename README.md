# mods-web-data

This repo contains all of the data that populates [my TS4 modding website](https://frankkmods.com).

Source data is written in `data/`, and it is built to `build/`. The build process involves:
- Minifying the JSONs
- Generating an index for all mods
- Consolidating each mods' meta data with its HTML pages

The website fetches data directly from the `build/` folder on the `prod` branch of this repo.
