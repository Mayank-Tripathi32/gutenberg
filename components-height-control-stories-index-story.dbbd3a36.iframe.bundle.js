"use strict";(self.webpackChunkgutenberg=self.webpackChunkgutenberg||[]).push([[4774],{"./packages/block-editor/src/components/block-edit/context.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{B8:()=>DEFAULT_BLOCK_EDIT_CONTEXT,F9:()=>isPreviewModeKey,KY:()=>Provider,VN:()=>blockBindingsKey,dg:()=>mayDisplayParentControlsKey,dk:()=>mayDisplayControlsKey,gF:()=>blockEditingModeKey,m_:()=>useBlockEditContext});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const mayDisplayControlsKey=Symbol("mayDisplayControls"),mayDisplayParentControlsKey=Symbol("mayDisplayParentControls"),blockEditingModeKey=Symbol("blockEditingMode"),blockBindingsKey=Symbol("blockBindings"),isPreviewModeKey=Symbol("isPreviewMode"),DEFAULT_BLOCK_EDIT_CONTEXT={name:"",isSelected:!1},Context=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)(DEFAULT_BLOCK_EDIT_CONTEXT),{Provider}=Context;function useBlockEditContext(){return(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(Context)}},"./packages/block-editor/src/components/use-settings/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{t:()=>useSettings});var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/data/build-module/components/use-select/index.js"),_block_edit__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/block-editor/src/components/block-edit/context.js"),_store__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/block-editor/src/store/index.js"),_lock_unlock__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/block-editor/src/lock-unlock.ts");function useSettings(...paths){const{clientId=null}=(0,_block_edit__WEBPACK_IMPORTED_MODULE_1__.m_)();return(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.A)((select=>(0,_lock_unlock__WEBPACK_IMPORTED_MODULE_3__.T)(select(_store__WEBPACK_IMPORTED_MODULE_0__.M)).getBlockSettings(clientId,...paths)),[clientId,...paths])}},"./packages/compose/build-module/hooks/use-merge-refs/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>useMergeRefs});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function assignRef(ref,value){"function"==typeof ref?ref(value):ref&&ref.hasOwnProperty("current")&&(ref.current=value)}function useMergeRefs(refs){const element=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(),isAttachedRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),didElementChangeRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),previousRefsRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),currentRefsRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(refs);return currentRefsRef.current=refs,(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)((()=>{!1===didElementChangeRef.current&&!0===isAttachedRef.current&&refs.forEach(((ref,index)=>{const previousRef=previousRefsRef.current[index];ref!==previousRef&&(assignRef(previousRef,null),assignRef(ref,element.current))})),previousRefsRef.current=refs}),refs),(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)((()=>{didElementChangeRef.current=!1})),(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((value=>{assignRef(element,value),didElementChangeRef.current=!0,isAttachedRef.current=null!==value;const refsToAssign=value?currentRefsRef.current:previousRefsRef.current;for(const ref of refsToAssign)assignRef(ref,value)}),[])}},"./packages/compose/build-module/hooks/use-previous/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>usePrevious});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function usePrevious(value){const ref=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)();return(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{ref.current=value}),[value]),ref.current}},"./packages/compose/build-module/hooks/use-ref-effect/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>useRefEffect});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function useRefEffect(callback,dependencies){const cleanupRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)();return(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((node=>{node?cleanupRef.current=callback(node):cleanupRef.current&&cleanupRef.current()}),dependencies)}},"./packages/is-shallow-equal/build-module/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ay:()=>isShallowEqual});var objects=__webpack_require__("./packages/is-shallow-equal/build-module/objects.js");function isShallowEqual(a,b){if(a&&b){if(a.constructor===Object&&b.constructor===Object)return(0,objects.A)(a,b);if(Array.isArray(a)&&Array.isArray(b))return function isShallowEqualArrays(a,b){if(a===b)return!0;if(a.length!==b.length)return!1;for(let i=0,len=a.length;i<len;i++)if(a[i]!==b[i])return!1;return!0}(a,b)}return a===b}},"./packages/is-shallow-equal/build-module/objects.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function isShallowEqualObjects(a,b){if(a===b)return!0;const aKeys=Object.keys(a),bKeys=Object.keys(b);if(aKeys.length!==bKeys.length)return!1;let i=0;for(;i<aKeys.length;){const key=aKeys[i],aValue=a[key];if(void 0===aValue&&!b.hasOwnProperty(key)||aValue!==b[key])return!1;i++}return!0}__webpack_require__.d(__webpack_exports__,{A:()=>isShallowEqualObjects})},"./packages/keycodes/build-module/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{EN:()=>F10,Fm:()=>ENTER,G_:()=>BACKSPACE,JF:()=>rawShortcut,Kp:()=>END,M3:()=>LEFT,NS:()=>RIGHT,Nx:()=>PAGEUP,PX:()=>DOWN,SJ:()=>DELETE,UP:()=>UP,W3:()=>PAGEDOWN,_A:()=>shortcutAriaLabel,_f:()=>ESCAPE,b:()=>displayShortcutList,dz:()=>displayShortcut,kx:()=>isKeyboardEvent,t6:()=>SPACE,wn:()=>TAB,yZ:()=>HOME});var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/i18n/build-module/index.js"),_platform__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/keycodes/build-module/platform.js");const BACKSPACE=8,TAB=9,ENTER=13,ESCAPE=27,SPACE=32,PAGEUP=33,PAGEDOWN=34,END=35,HOME=36,LEFT=37,UP=38,RIGHT=39,DOWN=40,DELETE=46,F10=121,ALT="alt",CTRL="ctrl",COMMAND="meta",SHIFT="shift";function capitaliseFirstCharacter(string){return string.length<2?string.toUpperCase():string.charAt(0).toUpperCase()+string.slice(1)}function mapValues(object,mapFn){return Object.fromEntries(Object.entries(object).map((([key,value])=>[key,mapFn(value)])))}const modifiers={primary:_isApple=>_isApple()?[COMMAND]:[CTRL],primaryShift:_isApple=>_isApple()?[SHIFT,COMMAND]:[CTRL,SHIFT],primaryAlt:_isApple=>_isApple()?[ALT,COMMAND]:[CTRL,ALT],secondary:_isApple=>_isApple()?[SHIFT,ALT,COMMAND]:[CTRL,SHIFT,ALT],access:_isApple=>_isApple()?[CTRL,ALT]:[SHIFT,ALT],ctrl:()=>[CTRL],alt:()=>[ALT],ctrlShift:()=>[CTRL,SHIFT],shift:()=>[SHIFT],shiftAlt:()=>[SHIFT,ALT],undefined:()=>[]},rawShortcut=mapValues(modifiers,(modifier=>(character,_isApple=_platform__WEBPACK_IMPORTED_MODULE_1__.H)=>[...modifier(_isApple),character.toLowerCase()].join("+"))),displayShortcutList=mapValues(modifiers,(modifier=>(character,_isApple=_platform__WEBPACK_IMPORTED_MODULE_1__.H)=>{const isApple=_isApple(),replacementKeyMap={[ALT]:isApple?"⌥":"Alt",[CTRL]:isApple?"⌃":"Ctrl",[COMMAND]:"⌘",[SHIFT]:isApple?"⇧":"Shift"};return[...modifier(_isApple).reduce(((accumulator,key)=>{var _replacementKeyMap$ke;const replacementKey=null!==(_replacementKeyMap$ke=replacementKeyMap[key])&&void 0!==_replacementKeyMap$ke?_replacementKeyMap$ke:key;return isApple?[...accumulator,replacementKey]:[...accumulator,replacementKey,"+"]}),[]),capitaliseFirstCharacter(character)]})),displayShortcut=mapValues(displayShortcutList,(shortcutList=>(character,_isApple=_platform__WEBPACK_IMPORTED_MODULE_1__.H)=>shortcutList(character,_isApple).join(""))),shortcutAriaLabel=mapValues(modifiers,(modifier=>(character,_isApple=_platform__WEBPACK_IMPORTED_MODULE_1__.H)=>{const isApple=_isApple(),replacementKeyMap={[SHIFT]:"Shift",[COMMAND]:isApple?"Command":"Control",[CTRL]:"Control",[ALT]:isApple?"Option":"Alt",",":(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Comma"),".":(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Period"),"`":(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Backtick"),"~":(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Tilde")};return[...modifier(_isApple),character].map((key=>{var _replacementKeyMap$ke2;return capitaliseFirstCharacter(null!==(_replacementKeyMap$ke2=replacementKeyMap[key])&&void 0!==_replacementKeyMap$ke2?_replacementKeyMap$ke2:key)})).join(isApple?" ":" + ")}));const isKeyboardEvent=mapValues(modifiers,(getModifiers=>(event,character,_isApple=_platform__WEBPACK_IMPORTED_MODULE_1__.H)=>{const mods=getModifiers(_isApple),eventMods=function getEventModifiers(event){return[ALT,CTRL,COMMAND,SHIFT].filter((key=>event[`${key}Key`]))}(event),replacementWithShiftKeyMap={Comma:",",Backslash:"\\",IntlRo:"\\",IntlYen:"\\"},modsDiff=mods.filter((mod=>!eventMods.includes(mod))),eventModsDiff=eventMods.filter((mod=>!mods.includes(mod)));if(modsDiff.length>0||eventModsDiff.length>0)return!1;let key=event.key.toLowerCase();return character?(event.altKey&&1===character.length&&(key=String.fromCharCode(event.keyCode).toLowerCase()),event.shiftKey&&1===character.length&&replacementWithShiftKeyMap[event.code]&&(key=replacementWithShiftKeyMap[event.code]),"del"===character&&(character="delete"),key===character.toLowerCase()):mods.includes(key)}))},"./packages/keycodes/build-module/platform.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function isAppleOS(_window=null){if(!_window){if("undefined"==typeof window)return!1;_window=window}const{platform}=_window.navigator;return-1!==platform.indexOf("Mac")||["iPad","iPhone"].includes(platform)}__webpack_require__.d(__webpack_exports__,{H:()=>isAppleOS})},"./packages/block-editor/src/components/height-control/stories/index.story.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,default:()=>index_story});var react=__webpack_require__("./node_modules/react/index.js"),utils=__webpack_require__("./packages/components/build-module/unit-control/utils.js"),base_control=__webpack_require__("./packages/components/build-module/base-control/index.js"),component=__webpack_require__("./packages/components/build-module/flex/flex/component.js"),flex_item_component=__webpack_require__("./packages/components/build-module/flex/flex-item/component.js"),unit_control=__webpack_require__("./packages/components/build-module/unit-control/index.js"),spacer_component=__webpack_require__("./packages/components/build-module/spacer/component.js"),range_control=__webpack_require__("./packages/components/build-module/range-control/index.js"),build_module=__webpack_require__("./packages/i18n/build-module/index.js"),use_settings=__webpack_require__("./packages/block-editor/src/components/use-settings/index.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const RANGE_CONTROL_CUSTOM_SETTINGS={px:{max:1e3,step:1},"%":{max:100,step:1},vw:{max:100,step:1},vh:{max:100,step:1},em:{max:50,step:.1},rem:{max:50,step:.1},svw:{max:100,step:1},lvw:{max:100,step:1},dvw:{max:100,step:1},svh:{max:100,step:1},lvh:{max:100,step:1},dvh:{max:100,step:1},vi:{max:100,step:1},svi:{max:100,step:1},lvi:{max:100,step:1},dvi:{max:100,step:1},vb:{max:100,step:1},svb:{max:100,step:1},lvb:{max:100,step:1},dvb:{max:100,step:1},vmin:{max:100,step:1},svmin:{max:100,step:1},lvmin:{max:100,step:1},dvmin:{max:100,step:1},vmax:{max:100,step:1},svmax:{max:100,step:1},lvmax:{max:100,step:1},dvmax:{max:100,step:1}};function HeightControl({label=(0,build_module.__)("Height"),onChange,value}){var _RANGE_CONTROL_CUSTOM,_RANGE_CONTROL_CUSTOM2;const customRangeValue=parseFloat(value),[availableUnits]=(0,use_settings.t)("spacing.units"),units=(0,utils.E)({availableUnits:availableUnits||["%","px","em","rem","vh","vw"]}),selectedUnit=(0,react.useMemo)((()=>(0,utils.bu)(value)),[value])[1]||units[0]?.value||"px";return(0,jsx_runtime.jsxs)("fieldset",{className:"block-editor-height-control",children:[(0,jsx_runtime.jsx)(base_control.Ay.VisualLabel,{as:"legend",children:label}),(0,jsx_runtime.jsxs)(component.A,{children:[(0,jsx_runtime.jsx)(flex_item_component.A,{isBlock:!0,children:(0,jsx_runtime.jsx)(unit_control.Ay,{value,units,onChange,onUnitChange:newUnit=>{const[currentValue,currentUnit]=(0,utils.bu)(value);["em","rem"].includes(newUnit)&&"px"===currentUnit?onChange((currentValue/16).toFixed(2)+newUnit):["em","rem"].includes(currentUnit)&&"px"===newUnit?onChange(Math.round(16*currentValue)+newUnit):["%","vw","svw","lvw","dvw","vh","svh","lvh","dvh","vi","svi","lvi","dvi","vb","svb","lvb","dvb","vmin","svmin","lvmin","dvmin","vmax","svmax","lvmax","dvmax"].includes(newUnit)&&currentValue>100&&onChange(100+newUnit)},min:0,size:"__unstable-large",label,hideLabelFromVision:!0})}),(0,jsx_runtime.jsx)(flex_item_component.A,{isBlock:!0,children:(0,jsx_runtime.jsx)(spacer_component.A,{marginX:2,marginBottom:0,children:(0,jsx_runtime.jsx)(range_control.A,{__next40pxDefaultSize:!0,value:customRangeValue,min:0,max:null!==(_RANGE_CONTROL_CUSTOM=RANGE_CONTROL_CUSTOM_SETTINGS[selectedUnit]?.max)&&void 0!==_RANGE_CONTROL_CUSTOM?_RANGE_CONTROL_CUSTOM:100,step:null!==(_RANGE_CONTROL_CUSTOM2=RANGE_CONTROL_CUSTOM_SETTINGS[selectedUnit]?.step)&&void 0!==_RANGE_CONTROL_CUSTOM2?_RANGE_CONTROL_CUSTOM2:.1,withInputField:!1,onChange:next=>{onChange([next,selectedUnit].join(""))},__nextHasNoMarginBottom:!0,label,hideLabelFromVision:!0})})})]})]})}HeightControl.displayName="HeightControl",HeightControl.__docgenInfo={description:"HeightControl renders a linked unit control and range control for adjusting the height of a block.\n\n@see https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/height-control/README.md\n\n@param {Object}                     props\n@param {?string}                    props.label    A label for the control.\n@param {( value: string ) => void } props.onChange Called when the height changes.\n@param {string}                     props.value    The current height value.\n\n@return {Component} The component to be rendered.",methods:[],displayName:"HeightControl",props:{label:{defaultValue:{value:"__( 'Height' )",computed:!0},required:!1}}};const index_story={component:HeightControl,title:"BlockEditor/HeightControl",parameters:{sourceLink:"packages/block-editor/src/components/height-control",badges:[]}},Template=props=>{const[value,setValue]=(0,react.useState)();return(0,jsx_runtime.jsx)(HeightControl,{onChange:setValue,value,...props})};Template.displayName="Template";const Default=Template.bind({});Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"props => {\n  const [value, setValue] = useState();\n  return <HeightControl onChange={setValue} value={value} {...props} />;\n}",...Default.parameters?.docs?.source}}}}}]);