---
name: Add audio device selector
about: Let users choose microphone and speaker
title: "[FEATURE] Audio device selector"
labels: enhancement, good first issue
---

**Description**
Currently the softphone uses the default audio device. Users should be able to select their preferred microphone and speaker from a dropdown.

**Acceptance Criteria**
- [ ] Enumerate available audio devices on page load
- [ ] Show dropdown for microphone selection
- [ ] Show dropdown for speaker selection
- [ ] Save preference to localStorage
- [ ] Apply selected devices to SIP calls

**Additional context**
This is important for users with multiple audio devices (headsets, USB mics, etc.).
