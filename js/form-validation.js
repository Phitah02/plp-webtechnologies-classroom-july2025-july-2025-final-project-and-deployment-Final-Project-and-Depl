/**
 * Rongai Agroforestry Community Project
 * Form Validation JavaScript
 * Handles contact form validation and submission
 */

(function() {
    'use strict';

    // Validation Rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s'-]+$/,
            message: 'Please enter a valid name (2-50 characters, letters only)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: false,
            pattern: /^[\+]?[1-9][\d]{0,15}$/,
            message: 'Please enter a valid phone number'
        },
        subject: {
            required: true,
            message: 'Please select a subject'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            message: 'Message must be between 10 and 1000 characters'
        }
    };

    // Error Messages
    const errorMessages = {
        required: 'This field is required',
        minLength: 'Must be at least {0} characters long',
        maxLength: 'Must be no more than {0} characters long',
        pattern: 'Please enter a valid format',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number'
    };

    // Form Validation Class
    class FormValidator {
        constructor(form) {
            this.form = form;
            this.fields = {};
            this.isSubmitting = false;
            this.init();
        }

        init() {
            this.setupFields();
            this.bindEvents();
            this.setupRealTimeValidation();
        }

        setupFields() {
            const inputs = this.form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                const name = input.name;
                if (name && validationRules[name]) {
                    this.fields[name] = {
                        element: input,
                        rules: validationRules[name],
                        errorElement: document.getElementById(`${name}-error`)
                    };
                }
            });
        }

        bindEvents() {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Reset validation on form reset
            this.form.addEventListener('reset', () => this.clearAllErrors());
        }

        setupRealTimeValidation() {
            Object.values(this.fields).forEach(field => {
                field.element.addEventListener('blur', () => this.validateField(field));
                field.element.addEventListener('input', () => this.clearFieldError(field));
            });
        }

        validateField(field) {
            const value = field.element.value.trim();
            const rules = field.rules;
            let isValid = true;
            let errorMessage = '';

            // Required validation
            if (rules.required && !value) {
                isValid = false;
                errorMessage = errorMessages.required;
            }

            // Skip other validations if field is empty and not required
            if (!value && !rules.required) {
                this.setFieldValid(field);
                return true;
            }

            // Pattern validation
            if (value && rules.pattern && !rules.pattern.test(value)) {
                isValid = false;
                errorMessage = rules.message || errorMessages.pattern;
            }

            // Length validation
            if (value && rules.minLength && value.length < rules.minLength) {
                isValid = false;
                errorMessage = errorMessages.minLength.replace('{0}', rules.minLength);
            }

            if (value && rules.maxLength && value.length > rules.maxLength) {
                isValid = false;
                errorMessage = errorMessages.maxLength.replace('{0}', rules.maxLength);
            }

            // Special email validation
            if (field.element.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = errorMessages.email;
                }
            }

            // Special phone validation
            if (field.element.type === 'tel' && value) {
                const cleanPhone = value.replace(/\s/g, '');
                if (!rules.pattern.test(cleanPhone)) {
                    isValid = false;
                    errorMessage = errorMessages.phone;
                }
            }

            if (isValid) {
                this.setFieldValid(field);
                return true;
            } else {
                this.setFieldError(field, errorMessage);
                return false;
            }
        }

        setFieldError(field, message) {
            field.element.classList.add('error');
            field.element.classList.remove('valid');

            if (field.errorElement) {
                field.errorElement.textContent = message;
                field.errorElement.style.display = 'block';
            }
        }

        setFieldValid(field) {
            field.element.classList.add('valid');
            field.element.classList.remove('error');

            if (field.errorElement) {
                field.errorElement.textContent = '';
                field.errorElement.style.display = 'none';
            }
        }

        clearFieldError(field) {
            field.element.classList.remove('error', 'valid');

            if (field.errorElement) {
                field.errorElement.textContent = '';
                field.errorElement.style.display = 'none';
            }
        }

        clearAllErrors() {
            Object.values(this.fields).forEach(field => {
                this.clearFieldError(field);
            });
        }

        validateForm() {
            let isFormValid = true;

            Object.values(this.fields).forEach(field => {
                if (!this.validateField(field)) {
                    isFormValid = false;
                }
            });

            return isFormValid;
        }

        handleSubmit(e) {
            e.preventDefault();

            if (this.isSubmitting) return;

            // Validate all fields
            if (!this.validateForm()) {
                // Focus on first error field
                const firstErrorField = Object.values(this.fields).find(field =>
                    field.element.classList.contains('error')
                );

                if (firstErrorField) {
                    firstErrorField.element.focus();
                    firstErrorField.element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }

                return;
            }

            this.submitForm();
        }

        submitForm() {
            this.isSubmitting = true;
            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Collect form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            // Add timestamp and user agent
            data.timestamp = new Date().toISOString();
            data.userAgent = navigator.userAgent;

            // Simulate API call (replace with actual endpoint)
            this.sendToAPI(data)
                .then(response => this.handleSuccess(response))
                .catch(error => this.handleError(error))
                .finally(() => {
                    this.isSubmitting = false;
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        }

        sendToAPI(data) {
            return new Promise((resolve, reject) => {
                // Simulate network delay
                setTimeout(() => {
                    // Simulate success/failure (90% success rate)
                    if (Math.random() > 0.1) {
                        resolve({
                            success: true,
                            message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
                        });
                    } else {
                        reject({
                            success: false,
                            message: 'There was an error sending your message. Please try again.'
                        });
                    }
                }, 1500);
            });
        }

        handleSuccess(response) {
            this.showSuccessMessage(response.message);
            this.form.reset();
            this.clearAllErrors();

            // Track successful submission
            this.trackEvent('form_submission', {
                subject: this.form.subject.value,
                hasPhone: !!this.form.phone.value,
                hasNewsletter: this.form.newsletter?.checked
            });
        }

        handleError(error) {
            this.showErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
        }

        showSuccessMessage(message) {
            this.showMessage(message, 'success');
        }

        showErrorMessage(message) {
            this.showMessage(message, 'error');
        }

        showMessage(message, type) {
            // Remove existing messages
            const existingMessage = this.form.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageElement = document.createElement('div');
            messageElement.className = `form-message form-message--${type}`;
            messageElement.innerHTML = `
                <div class="form-message__icon">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                </div>
                <div class="form-message__text">${message}</div>
            `;

            // Add styles
            messageElement.style.cssText = `
                margin-top: 1rem;
                padding: 1rem;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 500;
                ${type === 'success'
                    ? 'background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;'
                    : 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
                }
            `;

            // Insert before submit button
            const submitButton = this.form.querySelector('button[type="submit"]');
            this.form.insertBefore(messageElement, submitButton);

            // Auto-hide after 5 seconds
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.style.opacity = '0';
                    messageElement.style.transform = 'translateY(-10px)';
                    setTimeout(() => messageElement.remove(), 300);
                }
            }, 5000);
        }

        trackEvent(eventName, data) {
            // Google Analytics 4 event tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    event_category: 'form',
                    event_label: data.subject || 'unknown',
                    ...data
                });
            }

            // Custom event for other tracking systems
            const customEvent = new CustomEvent('formSubmission', {
                detail: { eventName, data }
            });
            document.dispatchEvent(customEvent);
        }
    }

    // Initialize form validation when DOM is loaded
    const initFormValidation = () => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            new FormValidator(contactForm);
        }
    };

    // Initialize on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormValidation);
    } else {
        initFormValidation();
    }

    // Export for potential use in other scripts
    window.FormValidator = FormValidator;

})();
