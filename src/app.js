//autobind decorator. "PropertyDescriptor" returns "undefined"
// function autobind(
//   _target: object,
//   _propertyKey: string | symbol,
//   descriptor: TypedPropertyDescriptor<any>
// ) {
//   const originalMethod = descriptor.value;
//   const adjDescriptor: PropertyDescriptor = {
//     configurable: true,
//     get() {
//       const boundFn = originalMethod.bind(this);
//       return boundFn;
//     },
//   };
//   return adjDescriptor;
// }
// Drag and Drop interfaces
// This is special syntax from TS
/// <reference path="models/drag-drop.ts"/>
/// <reference path="models/project.ts"/>
/// <reference path="util/validation.ts"/>
/// <reference path="decorators/autobind.ts"/>
/// <reference path="components/base-component.ts"/>
/// <reference path="components/project-list.ts"/>
/// <reference path="components/project-input.ts"/>
/// <reference path="state/project-state.ts"/>
var App;
(function (App) {
    new App.ProjectInput();
    new App.ProjectList("active");
    new App.ProjectList("finished");
})(App || (App = {}));
