/* jshint ignore:start */
import ComponentRegistry from '../component/ComponentRegistry';
var Templates = ComponentRegistry.Templates;
// This file was automatically generated from SoyComponent.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace Templates.SoyComponent.
 * @hassoydeltemplate {ComponentChildren}
 */

if (typeof Templates.SoyComponent == 'undefined') { Templates.SoyComponent = {}; }


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
Templates.SoyComponent.__deltemplate_s2_26860e4b = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '-children-placeholder" data-component-children="">' + ((opt_data.children) ? soy.$$escapeHtml(opt_data.children) : '') + '</div>');
};
if (goog.DEBUG) {
  Templates.SoyComponent.__deltemplate_s2_26860e4b.soyTemplateName = 'Templates.SoyComponent.__deltemplate_s2_26860e4b';
}
soy.$$registerDelegateFn(soy.$$getDelTemplateId('ComponentChildren'), '', 0, Templates.SoyComponent.__deltemplate_s2_26860e4b);

/* jshint ignore:end */
