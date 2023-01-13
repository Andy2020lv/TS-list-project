//autobind decorator. "PropertyDescriptor" returns "undefined"
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function autobind(_, _2, descriptor) {
    var originalMethod = descriptor.value;
    var adjDescriptor = {
        configurable: true,
        get: function () {
            var boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
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
/// <reference path="drag-drop-interfaces.ts"/>
/// <reference path="project-model.ts"/>
var App;
(function (App) {
    var State = /** @class */ (function () {
        function State() {
            this.listeners = [];
        }
        State.prototype.addListener = function (listenerFn) {
            this.listeners.push(listenerFn);
        };
        return State;
    }());
    var ProjectState = /** @class */ (function (_super) {
        __extends(ProjectState, _super);
        function ProjectState() {
            var _this = _super.call(this) || this;
            _this.projects = [];
            return _this;
        }
        ProjectState.getInstance = function () {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance;
        };
        ProjectState.prototype.addProject = function (title, description, numOfPeople) {
            var newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        };
        ProjectState.prototype.moveProject = function (projectId, newStatus) {
            var project = this.projects.find(function (prj) { return prj.id === projectId; });
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        };
        ProjectState.prototype.updateListeners = function () {
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listenerFn = _a[_i];
                listenerFn(this.projects.slice());
            }
        };
        return ProjectState;
    }(State));
    var projectState = ProjectState.getInstance();
    function validate(validatableInput) {
        var isValid = true;
        if (validatableInput.required) {
            isValid =
                isValid && validatableInput.value.toString().trim().length !== 0;
        }
        if (validatableInput.minLength != undefined &&
            typeof validatableInput.value === "string") {
            isValid =
                isValid && validatableInput.value.length >= validatableInput.minLength;
        }
        if (validatableInput.maxLength != undefined &&
            typeof validatableInput.value === "string") {
            isValid =
                isValid && validatableInput.value.length <= validatableInput.maxLength;
        }
        if (validatableInput.min != null &&
            typeof validatableInput.value === "number") {
            isValid = isValid && validatableInput.value >= validatableInput.min;
        }
        if (validatableInput.max != null &&
            typeof validatableInput.value === "number") {
            isValid = isValid && validatableInput.value <= validatableInput.max;
        }
        return isValid;
    }
    //Component Bae Class
    var Component = /** @class */ (function () {
        function Component(templateId, hostElementId, insertAtStar, newElementId) {
            this.templateElement = document.getElementById(templateId);
            this.hostElement = document.getElementById(hostElementId);
            var importedNode = document.importNode(this.templateElement.content, true);
            this.element = importedNode.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtStar);
        }
        Component.prototype.attach = function (insertAtBeginning) {
            this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);
        };
        return Component;
    }());
    // ProjectItem class
    var ProjectItem = /** @class */ (function (_super) {
        __extends(ProjectItem, _super);
        function ProjectItem(hostId, project) {
            var _this = _super.call(this, "single-project", hostId, false, project.id) || this;
            _this.project = project;
            _this.configure();
            _this.renderContent();
            return _this;
        }
        Object.defineProperty(ProjectItem.prototype, "persons", {
            get: function () {
                if (this.project.people === 1) {
                    return "1 person";
                }
                else {
                    return "".concat(this.project.people, " persons");
                }
            },
            enumerable: false,
            configurable: true
        });
        ProjectItem.prototype.dragStartHandler = function (event) {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
        };
        ProjectItem.prototype.dragEndHandler = function (_) {
            console.log("Drag end");
        };
        ProjectItem.prototype.configure = function () {
            this.element.addEventListener("dragstart", this.dragStartHandler.bind(this));
            this.element.addEventListener("dragend", this.dragEndHandler);
        };
        ProjectItem.prototype.renderContent = function () {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent =
                this.persons + " assigned";
            this.element.querySelector("p").textContent = this.project.description;
        };
        __decorate([
            autobind
        ], ProjectItem.prototype, "dragStartHandler");
        return ProjectItem;
    }(Component));
    //ProjectList class
    var ProjectList = /** @class */ (function (_super) {
        __extends(ProjectList, _super);
        function ProjectList(type) {
            var _this = _super.call(this, "project-list", "app", false, "".concat(type, "-projects")) || this;
            _this.type = type;
            _this.assignedProjects = [];
            _this.configure();
            _this.renderContent();
            return _this;
        }
        ProjectList.prototype.dragOverHandler = function (event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
                event.preventDefault();
                var listEl = this.element.querySelector("ul");
                listEl.classList.add("droppable");
            }
        };
        ProjectList.prototype.dropHandler = function (event) {
            console.log("DROPPPEEEED", event.dataTransfer.getData("text/plain"));
            var prjId = event.dataTransfer.getData("text/plain");
            projectState.moveProject(prjId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
        };
        ProjectList.prototype.dragLeaveHandler = function (_) {
            var listEl = this.element.querySelector("ul");
            listEl.classList.remove("droppable");
        };
        ProjectList.prototype.configure = function () {
            var _this = this;
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            this.element.addEventListener("drop", this.dropHandler);
            projectState.addListener(function (projects) {
                // Filtering the projects
                var relevantProjects = projects.filter(function (prj) {
                    if (_this.type === "active") {
                        return prj.status === ProjectStatus.Active;
                    }
                    else {
                        return prj.status === ProjectStatus.Finished;
                    }
                });
                _this.assignedProjects = relevantProjects;
                _this.renderProjects();
            });
        };
        ProjectList.prototype.renderContent = function () {
            var listId = "".concat(this.type, "-projects-list");
            this.element.querySelector("ul").id = listId;
            this.element.querySelector("h2").textContent =
                this.type.toUpperCase() + " PROJECTS";
        };
        ProjectList.prototype.renderProjects = function () {
            var listEl = document.getElementById("".concat(this.type, "-projects-list"));
            listEl.innerHTML = "";
            for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
                var prjItem = _a[_i];
                new ProjectItem(this.element.querySelector("ul").id, prjItem);
            }
        };
        __decorate([
            autobind
        ], ProjectList.prototype, "dragOverHandler");
        __decorate([
            autobind
        ], ProjectList.prototype, "dropHandler");
        __decorate([
            autobind
        ], ProjectList.prototype, "dragLeaveHandler");
        return ProjectList;
    }(Component));
    //ProjectInput class
    var ProjectInput = /** @class */ (function (_super) {
        __extends(ProjectInput, _super);
        function ProjectInput() {
            var _this = _super.call(this, "project-input", "app", true, "user-input") || this;
            _this.titleInputElement = _this.element.querySelector("#title");
            _this.descriptionInputElement = _this.element.querySelector("#description");
            _this.peopleInputElement = _this.element.querySelector("#people");
            _this.configure();
            return _this;
        }
        ProjectInput.prototype.configure = function () {
            this.element.addEventListener("submit", this.sumbmitHandler.bind(this));
        };
        ProjectInput.prototype.renderContent = function () { };
        ProjectInput.prototype.gatherUserInput = function () {
            var enteredTitle = this.titleInputElement.value;
            var enteredDescription = this.descriptionInputElement.value;
            var enteredPeople = this.peopleInputElement.value;
            //
            var titleValidatable = {
                value: enteredTitle,
                required: true
            };
            var descriptionValidatable = {
                value: enteredDescription,
                required: true,
                minLength: 5
            };
            var peopleValidatable = {
                value: +enteredPeople,
                required: true,
                min: 1,
                max: 5
            };
            //Check if any of the fields are empty
            if (!validate(titleValidatable) ||
                !validate(descriptionValidatable) ||
                !validate(peopleValidatable)
            //   enteredTitle.trim().length === 0 ||
            //   enteredDescription.trim().length === 0 ||
            //   enteredPeople.trim().length === 0
            ) {
                alert("Invalid input, please try again");
                return;
            }
            else {
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
        };
        ProjectInput.prototype.clearInputs = function () {
            this.titleInputElement.value = "";
            this.descriptionInputElement.value = "";
            this.peopleInputElement.value = "";
        };
        ProjectInput.prototype.sumbmitHandler = function (event) {
            event.preventDefault();
            var userInput = this.gatherUserInput();
            //Check if it returned a tuple (a fixed size list)
            if (Array.isArray(userInput)) {
                var title = userInput[0], desc = userInput[1], people = userInput[2];
                projectState.addProject(title, desc, people);
                this.clearInputs();
            }
        };
        __decorate([
            autobind
        ], ProjectInput.prototype, "sumbmitHandler");
        return ProjectInput;
    }(Component));
    new ProjectInput();
    new ProjectList("active");
    new ProjectList("finished");
})(App || (App = {}));
