# CoomÜnity Pilgrim Video Player Analysis Report

**Generated:** 2025-06-03T04:55:00.671Z
**Target URL:** https://demo.coomunity.co/pilgrim/640baa58
**Player Type:** Vimeo
**Page Title:** Cöomunity Player

## Executive Summary

This report documents the analysis of the CoomÜnity Pilgrim video player page, with specific focus on the floating buttons functionality that appears over the video interface. This page represents an interactive video experience with overlay navigation elements.

## 🎬 Video Player Analysis

**Player Configuration:**
- **Type:** Vimeo
- **Custom Player:** ✅ Yes
- **Vimeo Integration:** ✅ Yes
- **Video Config:** ✅ Present

**Player Container:**

- **Container ID:** coomunity-player
- **Container Class:** iframe-container
- **Has Iframe:** ✅ Yes
- **Iframe Source:** https://player.vimeo.com/video/383005433?app_id=122963


**Overlay Features:**
- **Has Overlay:** ❌ No

## 🔘 Floating Buttons Analysis ⭐ **CRITICAL FUNCTIONALITY**

**Button Overview:**
- **Total Floating Buttons:** 4
- **Primary Button:** ✅ Present
- **Child Buttons:** 3

### **Primary Button Details:**

- **ID:** primary-float
- **Classes:** btn-hexa btn-hexa-color btn-hexa-big
- **Image:** /assets/img/btn/oo.png
- **Position:** Fixed positioning (20px from bottom, 3px from right)


### **Child Buttons Details:**


**Child Button 1:**
- **Classes:** btn-hexa btn-mid btn-cinema
- **Image:** /assets/img/btn/cam-gris.png
- **Is Child:** Yes

**Child Button 2:**
- **Classes:** btn-hexa btn-mid btn-plaza
- **Image:** /assets/img/btn/cart-gris.png
- **Is Child:** Yes

**Child Button 3:**
- **Classes:** btn-hexa btn-mid btn-aldea
- **Image:** /assets/img/btn/user-gris.png
- **Is Child:** Yes



### **Button Functionality Types:**


**Cinema Button:**
- **Classes:** btn-hexa btn-mid btn-cinema
- **Image:** /assets/img/btn/cam-gris.png
- **Has Click Handler:** ❌ No

**Plaza Button:**
- **Classes:** btn-hexa btn-mid btn-plaza
- **Image:** /assets/img/btn/cart-gris.png
- **Has Click Handler:** ❌ No

**Aldea Button:**
- **Classes:** btn-hexa btn-mid btn-aldea
- **Image:** /assets/img/btn/user-gris.png
- **Has Click Handler:** ❌ No



## 🎯 Button Interaction Results

**Interaction Test Results:**
- **Child Buttons Visible After Click:** ❌ No
- **Iframe Visible After Click:** ✅ Yes
- **Active Classes:** 1 elements with active state


**Active Elements:**
- ttour-bullet active (ID: No ID)


## 📱 Overlay Elements Analysis

**Total Overlay Elements:** 2


**Overlay Details:**

### Overlay 1
- **Class:** 
- **ID:** in-profile
- **Visible:** Yes
- **Position:** relative
- **Z-Index:** 9
- **Has Iframe:** Yes
- **Iframe Source:** https://demo.coomunity.co/profile/640baa58?survey=0

### Overlay 2
- **Class:** iprofile
- **ID:** iprofile
- **Visible:** No
- **Position:** fixed
- **Z-Index:** auto
- **Has Iframe:** No
- **Iframe Source:** No iframe



## 🎮 Interactive Elements Summary

**Total Interactive Elements:** 5

**By Type:**
- Hexagonal: 4
- Standard: 1

**Floating Button Elements:** 4

## 🌐 Network Analysis

**Total Requests:** 142

**By Resource Type:**
- document: 18
- stylesheet: 7
- script: 66
- image: 24
- font: 1
- xhr: 17
- other: 1
- fetch: 8

**Video-Specific Requests:** 5
**Asset Requests:** 28

## 📊 Key Findings

1. **Video Player:** Custom CoomÜnity player with Vimeo integration
2. **Floating Buttons:** 4 floating buttons with interactive functionality
3. **Button Interaction:** Limited button interaction detected
4. **Overlay System:** 2 overlay elements for enhanced UX
5. **Navigation Integration:** Buttons provide navigation to Cinema, Plaza, and Aldea sections

## 📂 File Structure

```
./coomunity_pilgrim_demo/
├── html/
│   └── pilgrim_page.html
├── screenshots/
│   ├── 01_pilgrim_initial.png
│   ├── 02_attempting_video_play.png
│   ├── 03_after_video_attempt.png
│   ├── 04_before_button_click.png
│   └── 05_after_button_click.png
├── analysis/
│   ├── video_analysis.json
│   └── request_analysis.json
├── button_analysis/
│   └── floating_buttons_analysis.json
├── interactive_analysis/
│   └── detailed_interactive_analysis.json
├── video_data/
│   └── extracted_features.json
├── metadata/
│   └── complete_metadata.json
└── pilgrim_report.md
```

## 🎯 Button Functionality Summary

The floating buttons over the video provide:

1. **Primary Navigation Button:** Central hexagonal button that triggers menu expansion
2. **Child Navigation Buttons:** 
   - **Cinema Button:** Access to video/cinema section
   - **Plaza Button:** Access to marketplace/plaza section  
   - **Aldea Button:** Access to community/village section
3. **Overlay Integration:** Buttons control iframe overlays for seamless navigation
4. **Visual Feedback:** Rotation animations and state changes on interaction

## 🔍 Technical Implementation

**CSS Classes:**
- `.floating-buttons`: Container for floating button system
- `.btn-hexa`: Hexagonal button styling
- `.btn-hexa-big`: Primary button size
- `.btn-mid`: Child button size
- `.child-buttons`: Container for expandable child buttons

**JavaScript Functionality:**
- Click handlers for button expansion/collapse
- Iframe URL management and loading
- Animation controls (rotation, fade in/out)
- State management for active/inactive buttons

---

**Status:** ✅ **PILGRIM VIDEO PLAYER ANALYSIS COMPLETE**

The CoomÜnity Pilgrim video player page has been analyzed with specific focus on the floating buttons functionality. The system provides an innovative overlay navigation experience that enhances video viewing with contextual access to different platform sections.

**Critical Finding:** The floating buttons represent a sophisticated navigation overlay system that allows users to access different CoomÜnity sections (Cinema, Plaza, Aldea) without leaving the video experience.

**Last Updated:** 2025-06-03T04:55:00.671Z
