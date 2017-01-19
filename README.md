##ALPHA BRANCH ANNOUNCEMENT
We've created an Alpha Branch for the Hypergrid OpenSource project. 

###MOTIVATION
   * Intended to be used by contributors and consumers for testing Features/Fixes prior to being merged to Master branch
   * An environment for Sprint cycle efforts to be merged into for viewing/consumption
   * Alleviate integration and regression issues resulting from development efforts (code commits)
   * Create a more systematic software development process

###ALPHA 

####STEP 1 - GET IT AND INSTALL
A) Download or Clone branch from https://github.com/openfin/fin-hypergrid/tree/alpha
         Note: Alpha builds are subject to incremental changes. We will announce when this happens.

     > npm install       

  OR
      
B) NPM
 Point your package.json to:

     > "fin-hypergrid": "git@github.com:openfin/fin-hypergrid.git#alpha"

  OR
     
 Via npm install
   
    > npm install git+https://github.com/openfin/fin-hypergrid.git#alpha

For more info see the [npm docs](https://docs.npmjs.com/files/package.json#git-urls-as-dependencies)
####STEP 2 - TEST IT
        Validate it works.

Any questions, please contact us at support@openfin.co or open an [issue](https://github.com/openfin/fin-hypergrid/issues).


[![Build Status](https://travis-ci.org/openfin/fin-hypergrid.svg?branch=develop)](https://travis-ci.org/openfin/fin-hypergrid)

**fin-hypergrid** is an ultra-fast HTML5 grid presentation layer, achieving its speed by rendering (in a canvas tag) only the currently visible portion of your (virtual) grid, thus avoiding the latency and life-cycle issues of building, walking, and maintaining a complex DOM structure. Please be sure to checkout our [architectural overview](https://github.com/openfin/fin-hypergrid/blob/master/OVERVIEW.md) 

<img src="images/README/gridshot04.gif">

### Current Release (1.2.1 - 27 October 2016)

The current version 1.0 replaces last year's [prototype version](https://github.com/openfin/fin-hypergrid/tree/polymer-prototype), which was built around Polymer. It is now completely "de-polymerized" and is being made available as:
* An [npm module](https://www.npmjs.com/package/fin-hypergrid) for use with browserify.
* A single JavaScript file [fin-hypergrid.js](https://openfin.github.io/fin-hypergrid/build/fin-hypergrid.js) you can reference in a `<script>` tag.

_For a complete list of changes, see the [release notes](https://github.com/openfin/fin-hypergrid/releases)._

### Demos

##### Sample demo

Here is an [application](http://openfin.github.io/fin-hypergrid/) that demos various features.
   
##### Hyperblotter

Hyperblotter is a demo app that shows the capabilities of both OpenFin and Hypergrid.

Check out the Table view on Hyperblotter on a Windows machine via [this installer](https://dl.openfin.co/services/download?fileName=Hyperblotter&config=http://cdn.openfin.co/demos/hyperblotter/app.json).

![](https://github.com/openfin/fin-hypergrid/blob/master/images/README/Hyperblotter%20Tabled%20Reduced%20Rows.png)

### Features

![](https://github.com/openfin/fin-hypergrid/blob/master/images/README/Hypergrid%20Features.png)

### Developer Tutorial && Documentation

We have started a [wiki](https://github.com/openfin/fin-hypergrid/wiki). 

We are also maintaining [online API documentation](http://openfin.github.io/fin-hypergrid/doc/Hypergrid.html) for all public objects and modules. This documentation is necessarily a on-going work-in-progress.

(Cell editor information can be found [here](http://openfin.github.io/fin-hypergrid/doc/tutorial-cell-editors.html).)

(Cell Rendering information can be found [here](http://openfin.github.io/fin-hypergrid/doc/tutorial-cell-renderer.html).)

Hypergrid global configurations can be found [here](http://openfin.github.io/fin-hypergrid/doc/module-defaults.html). 

### Contributors

Developers interested in contributing to this project should review our [contributing guide](CONTRIBUTING.md) before making pull requests.
