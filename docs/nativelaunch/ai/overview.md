---
title: "AI Overview"
source: https://nativelaunch.dev/docs/ai/overview
fetched: 2026-07-07
---

# AI Overview

NativeLaunch includes an AI Assistant example inside the Notes application. This feature demonstrates how AI can be embedded into a real Expo / React Native mobile application using a clean and secure architecture. The goal of this page is to describe what is included in the starter and how AI is presented inside the product.

The AI Assistant is powered by OpenAI (ChatGPT) models and connected through a secure Supabase backend.

* * *

## How AI Is Presented in the Starter

The AI Assistant is implemented as a chat screen inside the Notes app. Users can:

-   Type messages manually
-   Upload an image for analysis

This is not a voice assistant. The assistant is designed as a practical in-app productivity tool.

![react-native expo ai assistant notes](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fai-assistant.0pjhbzt0ulvws.webp&w=3840&q=75)

* * *

## Built-in AI Actions

Inside the chat interface, two helper actions are available:

### Quick Summary

Generates a summary of the most recent notes. This demonstrates contextual summarization based on application data.

### Create Draft Note

Generates a draft note from user input. This demonstrates content generation inside a real workflow.

* * *

## Image Support

Users can upload an image in the chat. The AI analyzes the image and suggests structured note content. This demonstrates AI capabilities (text + image) integrated into a mobile UI.

* * *

## Purpose of This Example

The AI Assistant is provided as a reference feature. It shows how AI can:

-   Enhance user productivity
-   Integrate directly into existing workflows
-   Work with both text and images
-   Be embedded inside a real product UI

It provides a practical, production-ready starting point for adding AI features to your own mobile applications.
