/**
 * Applies form styling to the document body based on form settings
 */
export function applyFormStyling(formData: any) {
    if (!formData) return
  
    // Apply background styling
    if (formData.settings && formData.settings.customBackground) {
      // Apply the gradient background from form editor
      document.body.style.background = "linear-gradient(90deg, #3A4EFF 0%, #F77CFF 100%)"
    } else if (formData.background_color) {
      document.body.style.backgroundColor = formData.background_color
    }
  
    // Apply font family if specified
    if (formData.font_family) {
      document.body.style.fontFamily = formData.font_family
    }
  }
  
  /**
   * Cleans up form styling from the document body
   */
  export function cleanupFormStyling() {
    document.body.style.backgroundColor = ""
    document.body.style.background = ""
    document.body.style.fontFamily = ""
  }
  