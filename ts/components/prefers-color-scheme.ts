import { colorSchemeOptions, currentColorSchemeOptions } from '../interfaces';

export default class ColorSchemeController {

    private static readonly options: colorSchemeOptions = {
        dark: {
            text: 'Dark',
            value: 'dark'
        },

        light: {
            text: 'Light',
            value: 'light'
        },

        default: {
            text: 'System default',
            value: 'default'
        }
    };
    
    private static readonly systemPreference: MediaQueryList =
        window.matchMedia('(prefers-color-scheme: dark)');
    
    private readonly selectElement: HTMLSelectElement;
    private readonly currentPreference: string | null;

    constructor(selectElement: HTMLSelectElement) {

        this.selectElement = selectElement;
        this.currentPreference = ColorSchemeController.getCurrentPreference();

        if (this.currentPreference)
            ColorSchemeController.setPreference(this.currentPreference);

        else
            ColorSchemeController.setPreference();

        this.renderOptions();
        this.attachEventListeners();
    }

    private renderOptions(): void {

        this.selectElement.innerHTML = '';
        
        let optionValues = Object.getOwnPropertyNames(
            ColorSchemeController.options
        );
        
        let current: string | undefined = optionValues
            .find(option => option === this.currentPreference);
        
        if (current === undefined)
            current = ColorSchemeController.options.default.value;
        
        const second: string = optionValues
            .find(option => option !== current);
        
        const third: string = optionValues
            .find(option => option !== second && option !== current);
        
        const currentOptions: currentColorSchemeOptions = {
            current: ColorSchemeController.options[current],
            second: ColorSchemeController.options[second],
            third: ColorSchemeController.options[third]
        };

        for (const entry of Object.getOwnPropertyNames(currentOptions)) {

            const option: HTMLOptionElement = document.createElement('option');

            option.textContent = currentOptions[entry].text;
            option.value = currentOptions[entry].value;

            this.selectElement.appendChild(option);
        }
    }

    private attachEventListeners(): void {

        this.handleChange = this.handleChange.bind(this);
        this.handleSystemPreferenceChange =
            this.handleSystemPreferenceChange.bind(this);

        this.selectElement.addEventListener('change', this.handleChange);
        
        ColorSchemeController.systemPreference.addEventListener('change',
            this.handleSystemPreferenceChange
        );
    }

    private handleSystemPreferenceChange(): void {

        if (this.currentPreference !== ColorSchemeController.options.default.value)
            return;

        ColorSchemeController.setPreference();
    }

    private handleChange(): void {

        const selectedOption: HTMLOptionElement = this.selectElement.options.item(
            this.selectElement.options.selectedIndex
        );

        ColorSchemeController.setPreference(selectedOption.value);
    }

    private static getCurrentPreference(): string | null {
        return localStorage.getItem('preferred-color-scheme');
    }

    private static systemPreferenceIsDark(): Boolean {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    private static setPreference(
        preference: string = ColorSchemeController.options.default.value
    ): void {

        localStorage.setItem('preferred-color-scheme', preference);
        
        if (preference === ColorSchemeController.options.dark.value ||
            (preference === ColorSchemeController.options.default.value && this.systemPreferenceIsDark()))
            document.body.setAttribute('data-theme',
                ColorSchemeController.options.dark.value
            );
    
        else document.body.setAttribute('data-theme',
            ColorSchemeController.options.light.value
        );
    }
}