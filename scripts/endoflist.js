/**
 * Common JavaScript functionality for rendering the end of list template.
 */
(function($, Drupal, drupalSettings, Twig){

    var _endOfList = drupalSettings.end_of_list;
  
    /**
     * Removes the template.
     * @param $container
     */
    _endOfList.removeTemplate = function($container){
      $container.find('.end-of-list').remove();
    };
  
    /**
     * Renders the template.
     *
     * @param $container
     * @param list_opts
     */
    _endOfList.renderTemplate = function($container, list_opts){
      var html = Twig.twig({
        data: _endOfList.templates.end_of_list
      }).render(list_opts);
      $container.append(html);
    }
  
  })(jQuery, Drupal, drupalSettings, Twig);