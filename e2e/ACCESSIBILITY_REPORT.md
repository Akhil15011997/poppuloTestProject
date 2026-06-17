# Accessibility Test Report

## Test Run: 6/17/2026, 9:01:45 AM

## Home Page - WCAG 2.2 AA Scan

**URL:** https://automationexercise.com/
**Timestamp:** 2026-06-17T08:01:45.804Z

### Summary

| Metric | Count |
|--------|-------|
| Total Violations | 3 |
| Critical | 1 |
| Serious | 2 |
| Moderate | 0 |
| Minor | 0 |
| Passes | 17 |
| Incomplete | 1 |

### Violations

#### 1. 🔴 [CRITICAL] button-name

**Description:** Buttons must have discernible text

**WCAG:** wcag2a, wcag412

**Help:** [https://dequeuniversity.com/rules/axe/4.11/button-name?application=playwright](https://dequeuniversity.com/rules/axe/4.11/button-name?application=playwright)

**Affected Elements (1):**

- `#subscribe`
  - Fix any of the following:

#### 2. 🟠 [SERIOUS] color-contrast

**Description:** Elements must meet minimum color contrast ratio thresholds

**WCAG:** wcag2aa, wcag143

**Help:** [https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)

**Affected Elements (44):**

- `li:nth-child(1) > a[href="/"]`
  - Fix any of the following:
- `.active.item > .col-sm-6:nth-child(1) > h1`
  - Fix any of the following:
- `.active.item > .col-sm-6:nth-child(1) > h1 > span`
  - Fix any of the following:
- `.active.item > .col-sm-6:nth-child(1) > .test_cases_list[href$="test_cases"] > .btn-success[type="button"]`
  - Fix any of the following:
- `.active.item > .col-sm-6:nth-child(1) > .apis_list[href$="api_list"] > .btn-success[type="button"]`
  - Fix any of the following:
- ... and 39 more elements

#### 3. 🟠 [SERIOUS] link-name

**Description:** Links must have discernible text

**WCAG:** wcag2a, wcag244, wcag412

**Help:** [https://dequeuniversity.com/rules/axe/4.11/link-name?application=playwright](https://dequeuniversity.com/rules/axe/4.11/link-name?application=playwright)

**Affected Elements (4):**

- `.left.control-carousel.hidden-xs`
  - Fix all of the following:
- `.right.control-carousel.hidden-xs`
  - Fix all of the following:
- `.left.recommended-item-control[href="#recommended-item-carousel"]`
  - Fix all of the following:
- `.right.recommended-item-control[href="#recommended-item-carousel"]`
  - Fix all of the following:

---

