// Validation
interface Validation {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validateInput: Validation) {
    let isValid = true;
    if(validateInput.required) {
        isValid = isValid && validateInput.value.toString().trim().length !== 0;
    }
    if(validateInput.minLength != null && typeof validateInput.value === 'string') {
        isValid = isValid && validateInput.value.length > validateInput.minLength;
    }
    if(validateInput.maxLength != null && typeof validateInput.value === 'string') {
        isValid = isValid && validateInput.value.length < validateInput.maxLength;
    }
    if(validateInput.min != null && typeof validateInput.value === 'number') {
        isValid = isValid && validateInput.value > validateInput.min;
    }
    if(validateInput.max != null && typeof validateInput.value === 'number') {
        isValid = isValid && validateInput.value < validateInput.max;
    }
    return isValid;
}

// decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
    return adjDescriptor;  
}
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        // define with different approach but accomplish the same results
        this.templateElement = <HTMLTemplateElement>document.getElementById("project-input")!;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.config();
        this.attach();
    }

    private getherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredPeople = this.peopleInputElement.value
    
        const titleValidation: Validation = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidation: Validation = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidation: Validation = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
            
        }
        if(!validate(titleValidation) || !validate(descriptionValidation) || !validate(peopleValidation)) {
            alert('Invalid input, please try again');
            return
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    // Clear inputs
    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @autobind
    private handleSubmit(event: Event) {
        event.preventDefault();
        const userInput = this.getherUserInput();
        if(Array.isArray(userInput)) {
            const [title, desc, people ] = userInput;
            console.log(title, desc, people);
            this.clearInputs();
            
        }
        console.log('Radi ***', userInput)

    }

    private config() {
        this.element.addEventListener('submit', this.handleSubmit);
    }
    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}

const newProject = new ProjectInput();
