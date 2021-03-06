/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET    /': { view: 'pages/homepage' },

  /***************************************************************************
  *                                                                          *
  * Post Model Routes                                                               *
  *                                                                          *
  ***************************************************************************/
  'GET    /post': 'PostController.index',
  'POST   /post': 'PostController.store',
  'GET    /post/:postId': 'PostController.view',
  'GET    /post/:postId/image': 'PostController.image',


  /***************************************************************************
  *                                                                          *
  * API Routes                                                               *
  *                                                                          *
  ***************************************************************************/

  'POST   /api/register': { action: 'account/register' },
  'post   /api/login': { action: 'account/login' },
  'POST   /api/session': { action: 'account/session' },
  // 'POST    /api/v1/account/session': { action: 'account/session' },
  // 'POST    /api/v1/account/login': { action: 'account/login' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
