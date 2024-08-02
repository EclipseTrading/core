import { FinBar } from '../finbars/finbars';
import modules from './modules';
import { Hypergrid } from './types';
const Scrollbar = modules.Scrollbar;

/**
 * @typedef {any} Hypergrid TODO
 * @typedef {any} FinBar TODO
 */

/**
 * @summary Scrollbar support.
 * @desc Additions to `Hypergrid.prototype` for scrollbar support.
 *
 * All members are documented on the {@link Hypergrid} page.
 * @mixin scrolling.mixin
 */
exports.mixin = {

    /**
     * A float value between 0.0 - 1.0 of the vertical scroll position.
     * @type {number}
     * @memberOf Hypergrid#
     */
    vScrollValue: 0,

    /**
     * A float value between 0.0 - 1.0 of the horizontal scroll position.
     * @type {number}
     * @memberOf Hypergrid#
     */
    hScrollValue: 0,

    /**
     * The vertical scroll bar model/controller.
     * @type {FinBar}
     * @memberOf Hypergrid#
     */
    sbVScroller: null as FinBar | null,

    /**
     * The horizontal scroll bar model/controller.
     * @type {FinBar}
     * @memberOf Hypergrid#
     */
    sbHScroller: null as FinBar | null,

    /**
     * The previous value of sbVScrollVal.
     * @type {number}
     * @memberOf Hypergrid#
     */
    sbPrevVScrollValue: null,

    /**
     * The previous value of sbHScrollValue.
     * @type {number}
     * @memberOf Hypergrid#
     */
    sbPrevHScrollValue: null,

    scrollingNow: false,

    /**
     * @type {any} // Handle TS bug, remove this issue after resolved {@link https://github.com/microsoft/TypeScript/issues/41672}
     * @memberOf Hypergrid#
     * @summary Set for `scrollingNow` field.
     * @param {boolean} isItNow - The type of event we are interested in.
     */
    setScrollingNow: function (isItNow) {
        this.scrollingNow = isItNow;
    },

    /**
     * @memberOf Hypergrid#
     * @returns {boolean} The `scrollingNow` field.
     */
    isScrollingNow: function () {
        return this.scrollingNow;
    },

    /**
     * @memberOf Hypergrid#
     * @summary Scroll horizontal and vertically by the provided offsets.
     * @param {number} offsetX - Scroll in the x direction this much.
     * @param {number} offsetY - Scroll in the y direction this much.
     */
    scrollBy: function (offsetX, offsetY) {
        this.scrollHBy(offsetX);
        this.scrollVBy(offsetY);
    },

    /**
     * @memberOf Hypergrid#
     * @summary Scroll vertically by the provided offset.
     * @param {number} offsetY - Scroll in the y direction this much.
     */
    scrollVBy: function (offsetY) {
        var max = this.sbVScroller.range.max;
        var oldValue = this.getVScrollValue();
        var newValue = Math.min(max, Math.max(0, oldValue + offsetY));
        if (newValue !== oldValue) {
            this.setVScrollValue(newValue);
        }
    },

    /**
     * @memberOf Hypergrid#
     * @summary Scroll horizontally by the provided offset.
     * @param {number} offsetX - Scroll in the x direction this much.
     */
    scrollHBy: function (offsetX) {
        var max = this.sbHScroller.range.max;
        var oldValue = this.getHScrollValue();
        var newValue = Math.min(max, Math.max(0, oldValue + offsetX));
        if (newValue !== oldValue) {
            this.setHScrollValue(newValue);
        }
    },

    scrollToMakeVisible: function (c, r) {
        var delta,
            dw = this.renderer.dataWindow,
            fixedColumnCount = this.properties.fixedColumnCount,
            fixedRowCount = this.properties.fixedRowCount;

        // scroll only if target not in fixed columns
        if (c >= fixedColumnCount) {
            // target is to left of scrollable columns; negative delta scrolls left
            if ((delta = c - dw.origin.x) < 0) {
                this.sbHScroller.index += delta;

                // target is to right of scrollable columns; positive delta scrolls right
                // Note: The +1 forces right-most column to scroll left (just in case it was only partially in view)
            } else if ((c - dw.corner.x) > 0) {
                this.sbHScroller.index = this.renderer.getMinimumLeftPositionToShowColumn(c);
            }
            // VC-6393
            // move the scroll bar to right incase the target column is the last one
            if (c === this.renderer?.grid.numColumns - 1) {
                this.renderer.grid.scrollBy(1, 0);
            }
        }

        if (
            r >= fixedRowCount && // scroll only if target not in fixed rows
            (
                // target is above scrollable rows; negative delta scrolls up
                (delta = r - dw.origin.y - 1) < 0 ||

                // target is below scrollable rows; positive delta scrolls down
                (delta = r - dw.corner.y) > 0
            )
        ) {
            this.sbVScroller.index += delta;
        }
    },

    selectCellAndScrollToMakeVisible: function (c, r) {
        this.scrollToMakeVisible(c, r);
        this.selectCell(c, r, true);
    },

    /**
     * @type {any} // Handle TS bug, remove this issue after resolved {@link https://github.com/microsoft/TypeScript/issues/41672}
     * @memberOf Hypergrid#
     * @this {Hypergrid}
     * @desc Set the vertical scroll value.
     * @param {number} newValue - The new scroll value.
     */
    setVScrollValue: function (y) {
        var self = this;
        y = Math.min(this.sbVScroller.range.max, Math.max(0, Math.round(y)));
        if (y !== this.vScrollValue) {
            this.behavior.setScrollPositionY(y);
            this.behavior.changed();
            var oldY = this.vScrollValue;
            this.vScrollValue = y;
            this.sbVScroller.index = y;
            this.scrollValueChangedNotification();
            setTimeout(function () {
                // self.sbVRangeAdapter.subjectChanged();
                self.fireScrollEvent('fin-scroll-y', oldY, y);
            });
        }
    },

    /**
     * @memberOf Hypergrid#
     * @this {Hypergrid}
     * @return {number} The vertical scroll value.
     */
    getVScrollValue: function () {
        return this.vScrollValue;
    },

    /**
     * @type {any} // Handle TS bug, remove this issue after resolved {@link https://github.com/microsoft/TypeScript/issues/41672}
     * @memberOf Hypergrid#
     * @this {Hypergrid}
     * @desc Set the horizontal scroll value.
     * @param {number} x - The new scroll value.
     */
    setHScrollValue: function (x) {
        var self = this;
        x = Math.min(this.sbHScroller.range.max, Math.max(0, Math.round(x)));
        if (x !== this.hScrollValue) {
            this.behavior.setScrollPositionX(x);
            this.behavior.changed();
            var oldX = this.hScrollValue;
            this.hScrollValue = x;
            this.sbHScroller.index = x;
            this.scrollValueChangedNotification();
            setTimeout(function () {
                //self.sbHRangeAdapter.subjectChanged();
                self.fireScrollEvent('fin-scroll-x', oldX, x);
                //self.synchronizeScrollingBoundries(); // todo: Commented off to prevent the grid from bouncing back, but there may be repercussions...
            });
        }
    },

    /**
     * @memberOf Hypergrid#
     * @this {Hypergrid}
     * @returns The vertical scroll value.
     */
    getHScrollValue: function () {
        return this.hScrollValue;
    },

    /**
     * @type {any} // Handle TS bug, remove this issue after resolved {@link https://github.com/microsoft/TypeScript/issues/41672}
     * @memberOf Hypergrid#
     * @this {Hypergrid}
     * @desc Initialize the scroll bars.
     */
    initScrollbars: function () {
        if (this.sbHScroller && this.sbVScroller) {
            return;
        }

        var self = this;

        var horzBar = new Scrollbar({
            orientation: 'horizontal',
            deltaXFactor: this.constructor.defaults.wheelHFactor,
            onchange: self.setHScrollValue.bind(self),
            cssStylesheetReferenceElement: this.div,
            paging: false, // Jump to relative location instead.
        });

        var vertBar = new Scrollbar({
            orientation: 'vertical',
            deltaYFactor: this.constructor.defaults.wheelVFactor,
            onchange: self.setVScrollValue.bind(self),
            cssStylesheetReferenceElement: this.div,
            paging: false, // Jump to relative location instead.
        });

        this.sbHScroller = horzBar;
        this.sbVScroller = vertBar;

        var hPrefix = this.properties.hScrollbarClassPrefix;
        var vPrefix = this.properties.vScrollbarClassPrefix;

        if (hPrefix && hPrefix !== '') {
            this.sbHScroller.classPrefix = hPrefix;
        }

        if (vPrefix && vPrefix !== '') {
            this.sbVScroller.classPrefix = vPrefix;
        }

        this.div.appendChild(horzBar.bar);
        this.div.appendChild(vertBar.bar);

        this.resizeScrollbars();
    },

    resizeScrollbars(this: Hypergrid) {
        // Cache the current visibility state of the scrollbars.
        const hVisible = this.sbHScroller.isVisible;
        const vVisible = this.sbVScroller.isVisible;

        // Let the scrollbars resize themselves based on the content and container sizes.
        this.sbHScroller.shortenBy(this.sbVScroller).resize();
        this.sbVScroller
            // NOTE: Below is commented out because it would show a square in the corner not covered by the scroll bar.
            //.shortenBy(this.sbHScroller)
            .resize();

        // If visibility changed during scrollbar resize, then the grid shape changed, and the canvas should resize.
        if (this.sbHScroller.isVisible !== hVisible || this.sbVScroller.isVisible !== vVisible) {
            this.canvas.resize();
        }
    },

    /**
     * Scroll values have changed, we've been notified.
     */
    setVScrollbarValues(this: Hypergrid, max: number, containerSize: number) {
        // Set the scroll range, which by default resets the contentSize.
        this.sbVScroller.range = {
            min: 0,
            max: max
        };
        // Redefine the sizes.
        this.sbVScroller.contentSize = max + containerSize;
        this.sbVScroller.containerSize = containerSize;
    },

    setHScrollbarValues(this: Hypergrid, max: number, containerSize: number) {
        // Set the scroll range, which by default resets the contentSize.
        this.sbHScroller.range = {
            min: 0,
            max: max
        };
        // Redefine the sizes.
        this.sbHScroller.contentSize = max + containerSize;
        this.sbHScroller.containerSize = containerSize;
    },

    /**
     * @type {any} // Handle TS bug, remove this issue after resolved {@link https://github.com/microsoft/TypeScript/issues/41672}
     * @this {Hypergrid}
     */
    scrollValueChangedNotification: function () {
        if (
            this.hScrollValue !== this.sbPrevHScrollValue ||
            this.vScrollValue !== this.sbPrevVScrollValue
        ) {
            this.sbPrevHScrollValue = this.hScrollValue;
            this.sbPrevVScrollValue = this.vScrollValue;

            if (this.cellEditor) {
                this.cellEditor.scrollValueChangedNotification();
            }

            this.computeCellsBounds();
        }
    },

    /**
     * @memberOf Hypergrid#
     * @this {Hypergrid}
     * @desc The data dimensions have changed, or our pixel boundaries have changed.
     * Adjust the scrollbar properties as necessary.
     */
    synchronizeScrollingBoundaries() {
        var bounds = this.getBounds();
        if (!bounds) {
            return;
        }

        var numFixedColumns = this.getFixedColumnCount(),
            numColumns = this.getColumnCount(),
            numRows = this.getRowCount(),
            scrollableWidth = bounds.width - this.behavior.getFixedColumnsMaxWidth(),
            gridProps = this.properties,
            borderBox = gridProps.boxSizing === 'border-box',
            lineGap = borderBox ? 0 : gridProps.gridLinesVWidth;

        for (
            var columnsWidth = 0, lastPageColumnCount = 0;
            lastPageColumnCount < numColumns && columnsWidth < scrollableWidth;
            lastPageColumnCount++
        ) {
            columnsWidth += this.getColumnWidth(numColumns - lastPageColumnCount - 1) + lineGap;
        }
        if (columnsWidth > scrollableWidth) {
            lastPageColumnCount--;
        }

        // Note: Scrollable height excludes the header.
        var scrollableHeight = this.renderer.getVisibleScrollHeight();
        lineGap = borderBox ? 0 : gridProps.gridLinesHWidth; // NOTE: Excludes total row thickness.

        for (
            var rowsHeight = 0, lastPageRowCount = 0;
            lastPageRowCount < numRows && rowsHeight < scrollableHeight;
            lastPageRowCount++
        ) {
            rowsHeight += this.getRowHeight(numRows - lastPageRowCount - 1) + lineGap;
        }
        if (rowsHeight > scrollableHeight) {
            lastPageRowCount--;
        }

        // inform scroll bars
        if (this.sbHScroller) {
            var hMax = Math.max(0, numColumns - numFixedColumns - lastPageColumnCount);
            this.setHScrollbarValues(hMax, lastPageColumnCount);
            // When hMax is reduced, ensure the scroll position is not beyond the new max.
            this.setHScrollValue(Math.min(this.getHScrollValue(), hMax));
        }
        if (this.sbVScroller) {
            var vMax = Math.max(0, numRows - gridProps.fixedRowCount - lastPageRowCount);
            this.setVScrollbarValues(vMax, lastPageRowCount);
            // When vMax is reduced, ensure the scroll position is not beyond the new max.
            this.setVScrollValue(Math.min(this.getVScrollValue(), vMax));
        }

        this.computeCellsBounds();

        // schedule to happen *after* the repaint
        setTimeout(this.resizeScrollbars.bind(this));
    },

    /**
     * @memberOf Hypergrid#
     * @this {Hypergrid}
     * @desc Scroll up one full page when clicking outside scroll bar.
     * @returns {number}
     */
    pageUpScrollBar: function () {
        this.setVScrollValue(this.vScrollValue - this.sbVScroller.containerSize);
        return this.vScrollValue; // Fetch again, possibly adjusted for min range.
    },

    /**
     * @memberOf Hypergrid#
     * @this {Hypergrid}
     * @desc Scroll down one full page when clicking outside scroll bar.
     * @returns {number}
     */
    pageDownScrollBar: function () {
        this.setVScrollValue(this.vScrollValue + this.sbVScroller.containerSize);
        return this.vScrollValue; // Fetch again, possibly adjusted for min range.
    },

    /**
     * @memberOf Hypergrid#
     * @this {Hypergrid}
     * @desc Scroll up one full page. Select top-most cell
     * @returns {number}
     */
    pageUp: function () {
        var currentCell = this.lastSelection[0];
        var rowUpIndex = this.renderer.getPageUpRow();
        this.setVScrollValue(rowUpIndex);
        this.selectCell(currentCell.x, rowUpIndex, false);
        this.setMouseDown(this.newPoint(currentCell.x, rowUpIndex));
        this.repaint();
        return rowUpIndex;
    },

    /**
     * @memberOf Hypergrid#
     * @this {Hypergrid}
     * @desc Scroll down one full page. Select bottom-most cell
     * @returns {number}
     */
    pageDown: function () {
        var maxRow = this.getRowCount() - 1;
        var currentCell = this.lastSelection[0];
        var rowDownIndex = this.renderer.getPageDownRow();
        if (currentCell.y - rowDownIndex >= 0) {
            this.setVScrollValue(rowDownIndex);
            rowDownIndex += this.getVisibleRowsCount() - 1;
        }
        rowDownIndex >= maxRow ? rowDownIndex = maxRow : undefined;
        this.selectCell(currentCell.x, rowDownIndex, false);
        this.setMouseDown(this.newPoint(currentCell.x, rowDownIndex));
        this.repaint();
        return rowDownIndex;
    },

    /**
     * @memberOf Hypergrid#
     * @this {Hypergrid}
     * @desc Scroll entire page to most left. Select most-left cell
     */
    pageLeft: function () {
        var currentCell = this.lastSelection[0];
        this.setHScrollValue(this.sbHScroller.range.min)
        this.selectCell(0, currentCell.y, false);
        this.setMouseDown(this.newPoint(0, currentCell.y));
    },

    /**
     * @memberOf Hypergrid#
     * @this {Hypergrid}
     * @desc Scroll entire page to most right. Select most-right cell
     */
    pageRight: function () {
        var maxCol = this.numColumns - 1;
        var currentCell = this.lastSelection[0];
        this.setHScrollValue(this.sbHScroller.range.max)
        this.selectCell(maxCol, currentCell.y, false);
        this.setMouseDown(this.newPoint(maxCol, currentCell.y));
    },
};
