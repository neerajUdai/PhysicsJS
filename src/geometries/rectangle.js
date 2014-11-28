/**
 * class RectangleGeometry < Geometry
 *
 * Physics.geometry('rectangle')
 *
 * Geometry for rectangles.
 *
 * Additional config options:
 *
 * - width: The width
 * - height: The height
 *
 * Example:
 *
 * ```javascript
 * var rectGeo = Physics.geometry('rectangle', {
 *     width: 30,
 *     height: 40
 * });
 * ```
 **/
Physics.geometry('rectangle', function( parent ){

    var defaults = {

    };

    return {

        // extended
        init: function( options ){

            var self = this;

            // call parent init method
            parent.init.call(this, options);

            this.options.defaults( defaults );
            this.options.onChange(function( opts ){
                /**
                 * RectangleGeometry#width = Number
                 *
                 * The width
                 **/
                self.width = self.options.width || 1;
                /**
                 * RectangleGeometry#height = Number
                 *
                 * The height
                 **/
                self.height = self.options.height || 1;
            });
            this.options( options );
        },

        // extended
        aabb: function( angle ){

            if (!angle){
                return Physics.aabb( this.width, this.height );
            }

            var scratch = Physics.scratchpad()
                ,p = scratch.vector()
                ,trans = scratch.transform().toIdentity().rotate( -(angle || 0) )
                ,xaxis = trans.T( scratch.vector().set( 1, 0 ) )
                ,yaxis = trans.T( scratch.vector().set( 0, 1 ) )
                ,xmax = this.getFarthestHullPoint( xaxis, p ).proj( xaxis )
                ,xmin = - this.getFarthestHullPoint( xaxis.negate(), p ).proj( xaxis )
                ,ymax = this.getFarthestHullPoint( yaxis, p ).proj( yaxis )
                ,ymin = - this.getFarthestHullPoint( yaxis.negate(), p ).proj( yaxis )
                ;

            scratch.done();
            return Physics.aabb( xmin, ymin, xmax, ymax );
        },

        // extended
        getFarthestHullPoint: function( dir, result ){

            result = result || new Physics.vector();

            var x = dir.x
                ,y = dir.y
                ;

            x = x === 0 ? 0 : x < 0 ? -this.width * 0.5 : this.width * 0.5;
            y = y === 0 ? 0 : y < 0 ? -this.height * 0.5 : this.height * 0.5;

            return result.set( x, y );
        },

        // extended
        getFarthestCorePoint: function( dir, result, margin ){

            var x, y;
            result = this.getFarthestHullPoint( dir, result );
            x = result.x;
            y = result.y;
            result.x = x === 0 ? 0 : x < 0 ? x + margin : x - margin;
            result.y = y === 0 ? 0 : y < 0 ? y + margin : y - margin;

            return result;
        }
    };
});
