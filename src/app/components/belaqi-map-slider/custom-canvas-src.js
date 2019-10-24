const isRingBbox = function (ring, bbox) {
    if (ring.length !== 4) {
        return false;
    }

    let p, sumX = 0,
        sumY = 0;

    for (p = 0; p < 4; p++) {
        if ((ring[p].x !== bbox.min.x && ring[p].x !== bbox.max.x) ||
            (ring[p].y !== bbox.min.y && ring[p].y !== bbox.max.y)) {
            return false;
        }

        sumX += ring[p].x;
        sumY += ring[p].y;

        // bins[Number(ring[p].x === bbox.min.x) + 2 * Number(ring[p].y === bbox.min.y)] = 1;
    }

    // check that we have all 4 vertex of bbox in our geometry
    return sumX === 2 * (bbox.min.x + bbox.max.x) && sumY === 2 * (bbox.min.y + bbox.max.y);
};

L.TileLayer.CustomCanvas = L.TileLayer.WMS.extend({
    options: {
        boundary: null
    },

    initialize: function (url, options) {
        L.TileLayer.WMS.prototype['initialize'].call(this, url, options);
        this._boundaryCache = {}; // cache index "x:y:z"
        this._mercBoundary = null;
        this._mercBbox = null;

        if (this.options.trackAttribution) {
            this._attributionRemoved = true;
            this.getAttribution = null;
        }
    },

    createTile: function (coords, done) {
        const tile = document.createElement('canvas'),
            url = this.getTileUrl(coords);
        tile.width = tile.height = this.options.tileSize;
        this._drawTileInternal(tile, coords, url, L.Util.bind(done, null, null, tile));

        return tile;
    },

    _pruneTiles: function () {
        L.TileLayer.WMS.prototype['_pruneTiles'].call(this);
        for (const key in this._tiles) {
            if (parseInt(key.substr(key.indexOf(':', key.indexOf(':') + 1) + 1), 10) !== this._tileZoom) {
                this._removeTile(key);
            }
        }
    },

    _toMercGeometry: function (b, isGeoJSON) {
        const res = [];
        let c, r, p,
            mercComponent,
            mercRing,
            coords;

        if (!isGeoJSON) {
            if (!(b[0] instanceof Array)) {
                b = [
                    [b]
                ];
            } else if (!(b[0][0] instanceof Array)) {
                b = [b];
            }
        }

        for (c = 0; c < b.length; c++) {
            mercComponent = [];
            for (r = 0; r < b[c].length; r++) {
                mercRing = [];
                for (p = 0; p < b[c][r].length; p++) {
                    coords = isGeoJSON ? L.latLng(b[c][r][p][1], b[c][r][p][0]) : b[c][r][p];
                    mercRing.push(this._map.project(coords, 0));
                }
                mercComponent.push(mercRing);
            }
            res.push(mercComponent);
        }

        return res;
    },

    // lazy calculation of layer's boundary in map's projection. Bounding box is also calculated
    _getOriginalMercBoundary: function () {

        if (this._mercBoundary) {
            return this._mercBoundary;
        }

        let compomentBbox, c;

        if (L.Util.isArray(this.options.boundary)) { // Depricated: just array of coordinates
            this._mercBoundary = this._toMercGeometry(this.options.boundary);
        } else { // GeoJSON
            this._mercBoundary = [];
            const processGeoJSONObject = function (obj) {
                if (obj.type === 'GeometryCollection') {
                    obj.geometries.forEach(processGeoJSONObject);
                } else if (obj.type === 'Feature') {
                    processGeoJSONObject(obj.geometry);
                } else if (obj.type === 'FeatureCollection') {
                    obj.features.forEach(processGeoJSONObject);
                } else if (obj.type === 'Polygon') {
                    this._mercBoundary = this._mercBoundary.concat(this._toMercGeometry([obj.coordinates], true));
                } else if (obj.type === 'MultiPolygon') {
                    this._mercBoundary = this._mercBoundary.concat(this._toMercGeometry(obj.coordinates, true));
                }
            }.bind(this);
            processGeoJSONObject(this.options.boundary);
        }

        if (this._mercBoundary[0][0]) {
            this._mercBbox = new L.Bounds(this._mercBoundary[0][0]);
            for (c = 1; c < this._mercBoundary.length; c++) {
                compomentBbox = new L.Bounds(this._mercBoundary[c][0]);
                this._mercBbox.extend(compomentBbox.min);
                this._mercBbox.extend(compomentBbox.max);
            }
        }

        return this._mercBoundary;
    },

    _getClippedGeometry: function (geom, currentBounds) {
        const clippedGeom = [];
        let clippedComponent,
            clippedExternalRing,
            clippedHoleRing,
            iC, iR;

        for (iC = 0; iC < geom.length; iC++) {
            clippedComponent = [];
            clippedExternalRing = L.PolyUtil.clipPolygon(geom[iC][0], currentBounds);
            if (clippedExternalRing.length === 0) {
                continue;
            }

            clippedComponent.push(clippedExternalRing);

            for (iR = 1; iR < geom[iC].length; iR++) {
                clippedHoleRing = L.PolyUtil.clipPolygon(geom[iC][iR], currentBounds);
                if (clippedHoleRing.length > 0) {
                    clippedComponent.push(clippedHoleRing);
                }
            }
            clippedGeom.push(clippedComponent);
        }

        if (clippedGeom.length === 0) { // we are outside of all multipolygon components
            return {
                isOut: true
            };
        }

        for (iC = 0; iC < clippedGeom.length; iC++) {
            if (isRingBbox(clippedGeom[iC][0], currentBounds)) {
                // inside exterior rings and no holes
                if (clippedGeom[iC].length === 1) {
                    return {
                        isIn: true
                    };
                }
            } else { // intersects exterior ring
                return {
                    geometry: clippedGeom
                };
            }

            for (iR = 1; iR < clippedGeom[iC].length; iR++) {
                // inside exterior ring, but have intersection with a hole
                if (!isRingBbox(clippedGeom[iC][iR], currentBounds)) {
                    return {
                        geometry: clippedGeom
                    };
                }
            }
        }

        // we are inside all holes in geometry
        return {
            isOut: true
        };
    },

    // Calculates intersection of original boundary geometry and tile boundary.
    // Uses quadtree as cache to speed-up intersection.
    // Return
    //   {isOut: true} if no intersection,
    //   {isIn: true} if tile is fully inside layer's boundary
    //   {geometry: <LatLng[][][]>} otherwise
    _getTileGeometry: function (x, y, z, skipIntersectionCheck) {
        if (!skipIntersectionCheck && this.options.useBoundaryGreaterAsZoom && this.options.useBoundaryGreaterAsZoom >= z) {
            return { isIn: true };
        }

        if (!this.options.boundary) {
            return {
                isIn: true
            };
        }

        const cacheID = x + ':' + y + ':' + z,
            zCoeff = Math.pow(2, z),
            cache = this._boundaryCache;
        let parentState;

        if (cache[cacheID]) {
            return cache[cacheID];
        }

        const mercBoundary = this._getOriginalMercBoundary(),
            ts = this.options.tileSize,
            tileBbox = new L.Bounds(new L.Point(x * ts / zCoeff, y * ts / zCoeff), new L.Point((x + 1) * ts / zCoeff, (y + 1) * ts / zCoeff));

        // fast check intersection
        if (!skipIntersectionCheck && !tileBbox.intersects(this._mercBbox)) {
            return {
                isOut: true
            };
        }

        if (z === 0) {
            cache[cacheID] = {
                geometry: mercBoundary
            };
            return cache[cacheID];
        }

        parentState = this._getTileGeometry(Math.floor(x / 2), Math.floor(y / 2), z - 1, true);

        if (parentState.isOut || parentState.isIn) {
            return parentState;
        }

        cache[cacheID] = this._getClippedGeometry(parentState.geometry, tileBbox);
        return cache[cacheID];
    },

    _drawTileInternal: function (canvas, tilePoint, url, callback) {
        const zoom = this._getZoomForUrl(),
            state = this._getTileGeometry(tilePoint.x, tilePoint.y, zoom);

        if (state.isOut) {
            callback();
            return;
        }

        const ts = this.options.tileSize,
            tileX = ts * tilePoint.x,
            tileY = ts * tilePoint.y,
            zCoeff = Math.pow(2, zoom),
            ctx = canvas.getContext('2d'),
            imageObj = new Image();

        const setPattern = function () {
            let c, r, p,
                pattern,
                geom;

            if (!state.isIn) {
                geom = state.geometry;
                ctx.beginPath();

                for (c = 0; c < geom.length; c++) {
                    for (r = 0; r < geom[c].length; r++) {
                        if (geom[c][r].length === 0) {
                            continue;
                        }

                        ctx.moveTo(geom[c][r][0].x * zCoeff - tileX, geom[c][r][0].y * zCoeff - tileY);
                        for (p = 1; p < geom[c][r].length; p++) {
                            ctx.lineTo(geom[c][r][p].x * zCoeff - tileX, geom[c][r][p].y * zCoeff - tileY);
                        }
                    }
                }
                ctx.clip();
            }

            pattern = ctx.createPattern(imageObj, 'repeat');
            ctx.beginPath();
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = pattern;
            ctx.fill();
            callback();
        };

        if (this.options.crossOrigin) {
            imageObj.crossOrigin = '';
        }

        imageObj.onload = function () {
            // TODO: implement correct image loading cancelation
            canvas.complete = true; // HACK: emulate HTMLImageElement property to make happy L.TileLayer
            setTimeout(setPattern, 0); // IE9 bug - black tiles appear randomly if call setPattern() without timeout
        };

        imageObj.src = url;
    },

    onAdd: function (map) {
        L.TileLayer.WMS.prototype.onAdd.call(this, map);

        if (this.options.trackAttribution) {
            map.on('moveend', this._updateAttribution, this);
            this._updateAttribution();
        }
    },

    onRemove: function (map) {
        L.TileLayer.WMS.prototype.onRemove.call(this, map);

        if (this.options.trackAttribution) {
            map.off('moveend', this._updateAttribution, this);
            if (!this._attributionRemoved) {
                const attribution = L.TileLayer.CustomCanvas.prototype.getAttribution.call(this);
                map.attributionControl.removeAttribution(attribution);
            }
        }
    },

    _updateAttribution: function () {
        const geom = this._getOriginalMercBoundary(),
            mapBounds = this._map.getBounds(),
            mercBounds = bounds(this._map.project(mapBounds.getSouthWest(), 0), this._map.project(mapBounds.getNorthEast(), 0)),
            state = this._getClippedGeometry(geom, mercBounds);

        if (this._attributionRemoved !== !!state.isOut) {
            const attribution = L.TileLayer.CustomCanvas.prototype.getAttribution.call(this);
            this._map.attributionControl[state.isOut ? 'removeAttribution' : 'addAttribution'](attribution);
            this._attributionRemoved = !!state.isOut;
        }
    }

});

L.tileLayer.customCanvas = function (url, options) {
    return new L.TileLayer.CustomCanvas(url, options);
};


// The following section indicated by the line of stars was taken from
// https://github.com/MazeMap/Leaflet.TileLayer.PouchDBCached/tree/ca83b60dcdd276d7cd7f9c4f24eb1fd1138b2c72  
// at and is licensed under the MIT License as stated in the readme.md file.
// ***************************************START-OF-SECTION**********************************************

// HTMLCanvasElement.toBlob() polyfill
// copy-pasted off https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
if (!HTMLCanvasElement.prototype.toBlob) {
	Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
		value: function(callback, type, quality) {
			var dataURL = this.toDataURL(type, quality).split(",")[1];
			setTimeout(function() {
				var binStr = atob(dataURL),
					len = binStr.length,
					arr = new Uint8Array(len);

				for (var i = 0; i < len; i++) {
					arr[i] = binStr.charCodeAt(i);
				}

				callback(new Blob([arr], { type: type || "image/png" }));
			});
		},
	});
}

L.TileLayer.addInitHook(function() {
	if (!this.options.useCache) {
		this._db = null;
		return;
    }
    
    this._db = new PouchDB("offline-tiles");
});

// 🍂namespace TileLayer
// 🍂section PouchDB tile caching options
// 🍂option useCache: Boolean = false
// Whether to use a PouchDB cache on this tile layer, or not
L.TileLayer.prototype.options.useCache = false;

// 🍂option saveToCache: Boolean = true
// When caching is enabled, whether to save new tiles to the cache or not
L.TileLayer.prototype.options.saveToCache = true;

// 🍂option useOnlyCache: Boolean = false
// When caching is enabled, whether to request new tiles from the network or not
L.TileLayer.prototype.options.useOnlyCache = false;

// 🍂option cacheFormat: String = 'image/png'
// The image format to be used when saving the tile images in the cache
L.TileLayer.prototype.options.cacheFormat = "image/png";

// 🍂option cacheMaxAge: Number = 24*3600*1000
// Maximum age of the cache, in milliseconds
L.TileLayer.prototype.options.cacheMaxAge = 24 * 3600 * 1000;

L.TileLayer.include({
	// Overwrites L.TileLayer.prototype.createTile
	createTile: function(coords, done) {
		var tile = document.createElement("img");

		tile.onerror = L.bind(this._tileOnError, this, done, tile);

		if (this.options.crossOrigin) {
			tile.crossOrigin = "";
		}

		/*
		 Alt tag is *set to empty string to keep screen readers from reading URL and for compliance reasons
		 http://www.w3.org/TR/WCAG20-TECHS/H67
		 */
		tile.alt = "";

		var tileUrl = this.getTileUrl(coords);

		if (this.options.useCache) {
			this._db.get(
				tileUrl,
				{ revs_info: true },
				this._onCacheLookup(tile, tileUrl, done)
			);
		} else {
			// Fall back to standard behaviour
			tile.onload = L.bind(this._tileOnLoad, this, done, tile);
			tile.src = tileUrl;
		}

		return tile;
	},

	// Returns a callback (closure over tile/key/originalSrc) to be run when the DB
	//   backend is finished with a fetch operation.
	_onCacheLookup: function(tile, tileUrl, done) {
		return function(err, data) {
			if (data) {
				return this._onCacheHit(tile, tileUrl, data, done);
			} else {
				return this._onCacheMiss(tile, tileUrl, done);
			}
		}.bind(this);
	},

	_onCacheHit: function(tile, tileUrl, data, done) {
		this.fire("tilecachehit", {
			tile: tile,
			url: tileUrl,
		});

		// Read the attachment as blob
		this._db.getAttachment(tileUrl, "tile").then(
			function(blob) {
				var url = URL.createObjectURL(blob);

				if (
					Date.now() > data.timestamp + this.options.cacheMaxAge &&
					!this.options.useOnlyCache
				) {
					// Tile is too old, try to refresh it
					console.log("Tile is too old: ", tileUrl);

					if (this.options.saveToCache) {
						tile.onload = L.bind(
							this._saveTile,
							this,
							tile,
							tileUrl,
							data._revs_info[0].rev,
							done
						);
					}
					tile.crossOrigin = "Anonymous";
					tile.src = tileUrl;
					tile.onerror = function(ev) {
						// If the tile is too old but couldn't be fetched from the network,
						//   serve the one still in cache.
						this.src = url;
					};
				} else {
					// Serve tile from cached data
					//console.log('Tile is cached: ', tileUrl);
					tile.onload = L.bind(this._tileOnLoad, this, done, tile);
					tile.src = url;
				}
			}.bind(this)
		);
	},

	_onCacheMiss: function(tile, tileUrl, done) {
		this.fire("tilecachemiss", {
			tile: tile,
			url: tileUrl,
		});
		if (this.options.useOnlyCache) {
			// Offline, not cached
			// 	console.log('Tile not in cache', tileUrl);
			tile.onload = L.Util.falseFn;
			tile.src = L.Util.emptyImageUrl;
		} else {
			// Online, not cached, request the tile normally
			// console.log('Requesting tile normally', tileUrl);
			if (this.options.saveToCache) {
				tile.onload = L.bind(
					this._saveTile,
					this,
					tile,
					tileUrl,
					undefined,
					done
				);
			} else {
				tile.onload = L.bind(this._tileOnLoad, this, done, tile);
			}
			tile.crossOrigin = "Anonymous";
			tile.src = tileUrl;
		}
	},

	// Async'ly saves the tile as a PouchDB attachment
	// Will run the done() callback (if any) when finished.
	_saveTile: function(tile, tileUrl, existingRevision, done) {
		if (!this.options.saveToCache) {
			return;
		}

		var canvas = document.createElement("canvas");
		canvas.width = tile.naturalWidth || tile.width;
		canvas.height = tile.naturalHeight || tile.height;

		var context = canvas.getContext("2d");
		context.drawImage(tile, 0, 0);

		var format = this.options.cacheFormat;

		canvas.toBlob(
			function(blob) {
				this._db
					.put({
						_id: tileUrl,
						_rev: existingRevision,
						timestamp: Date.now(),
					})
					.then(
						function(status) {
							return this._db.putAttachment(
								tileUrl,
								"tile",
								status.rev,
								blob,
								format
							);
						}.bind(this)
					)
					.then(function(resp) {
						if (done) {
							done();
						}
					})
					.catch(function() {
						// Saving the tile to the cache might have failed, 
						// but the tile itself has been loaded.
						if (done) {
							done();
						}
					});
			}.bind(this),
			format
		);
	},

	// 🍂section PouchDB tile caching methods
	// 🍂method seed(bbox: LatLngBounds, minZoom: Number, maxZoom: Number): this
	// Starts seeding the cache given a bounding box and the minimum/maximum zoom levels
	// Use with care! This can spawn thousands of requests and flood tileservers!
	seed: function(bbox, minZoom, maxZoom) {
		if (!this.options.useCache) return;
		if (minZoom > maxZoom) return;
		if (!this._map) return;

		var queue = [];

		for (var z = minZoom; z <= maxZoom; z++) {
			// Geo bbox to pixel bbox (as per given zoom level)...
			var northEastPoint = this._map.project(bbox.getNorthEast(), z);
			var southWestPoint = this._map.project(bbox.getSouthWest(), z);

			// Then to tile coords bounds, as per GridLayer
			var tileBounds = this._pxBoundsToTileRange(
				L.bounds([northEastPoint, southWestPoint])
			);

			for (var j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
				for (var i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
					var point = new L.Point(i, j);
					point.z = z;
					queue.push(this._getTileUrl(point));
				}
			}
		}

		var seedData = {
			bbox: bbox,
			minZoom: minZoom,
			maxZoom: maxZoom,
			queueLength: queue.length,
		};
		this.fire("seedstart", seedData);
		var tile = this._createTile();
		tile._layer = this;
		this._seedOneTile(tile, queue, seedData);
		return this;
	},

	_createTile: function() {
		return document.createElement("img");
	},

	// Modified L.TileLayer.getTileUrl, this will use the zoom given by the parameter coords
	//  instead of the maps current zoomlevel.
	_getTileUrl: function(coords) {
		var zoom = coords.z;
		if (this.options.zoomReverse) {
			zoom = this.options.maxZoom - zoom;
		}
		zoom += this.options.zoomOffset;
		return L.Util.template(
			this._url,
			L.extend(
				{
					r:
						this.options.detectRetina &&
						L.Browser.retina &&
						this.options.maxZoom > 0
							? "@2x"
							: "",
					s: this._getSubdomain(coords),
					x: coords.x,
					y: this.options.tms
						? this._globalTileRange.max.y - coords.y
						: coords.y,
					z: this.options.maxNativeZoom
						? Math.min(zoom, this.options.maxNativeZoom)
						: zoom,
				},
				this.options
			)
		);
	},

	// Uses a defined tile to eat through one item in the queue and
	//   asynchronously recursively call itself when the tile has
	//   finished loading.
	_seedOneTile: function(tile, remaining, seedData) {
		if (!remaining.length) {
			this.fire("seedend", seedData);
			return;
		}
		this.fire("seedprogress", {
			bbox: seedData.bbox,
			minZoom: seedData.minZoom,
			maxZoom: seedData.maxZoom,
			queueLength: seedData.queueLength,
			remainingLength: remaining.length,
		});

		var url = remaining.shift();

		this._db.get(
			url,
			function(err, data) {
				if (!data) {
					/// FIXME: Do something on tile error!!
					tile.onload = function(ev) {
						this._saveTile(tile, url, null); //(ev)
						this._seedOneTile(tile, remaining, seedData);
					}.bind(this);
					tile.crossOrigin = "Anonymous";
					tile.src = url;
				} else {
					this._seedOneTile(tile, remaining, seedData);
				}
			}.bind(this)
		);
	},
});
// ***************************************END-OF-SECTION************************************************
