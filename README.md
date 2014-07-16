# Disquo

Data comparator for humans.

## Installation

* `git clone http://github.com:NoLiD/Disquo.git`
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your Disquo at http://localhost:4200.

## Building

* `ember build`

# TODO

- potential themes
    - flatstrap (unhealthy build status)
    - bootswatch.com/flatly
    - bootswatch.com/darkly
    - bootswatch.com/superhero
    - bootswatch.com/yeti

- in both html and css, make consistent the ids and classes
    - no camelCase (readability)
    - no dashes (javascript compliance>
    - all underscores

### index.html

- bootstrapify
    - use bootstrap modal for endpoint selector
        - bring back the tooltips
            - see if bootstrap popovers can have structured content
                - if not, ask stackoverflow how to get bla
    - fix hover response for glyphicons

- predicate view pane
    - mock hardcoded visual graph svg using d3

- other graph view pane
    - figure out what parts need to be different from

### stylesheet.css

- fix overflow in panel bug
