## Overview
This is a research project exploring how different tones of AI suggestions impact human writing. The project specifically examines the effects of positive and negative politeness strategies on user acceptance of AI-generated suggestions and their influence on their writing style. This github repository contains the code for the interface of the research project.

## Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [Data Analysis](#data-analysis)

## Features
**Interactive Writing Tool**: Users interact with an AI-powered text editor that provides writing suggestions in varying tones. The suggestions are generated after users type space and wait with no other action for 1.5 seconds. GPT4o API is used to generate suggestions. \
**Replay Function**: Each user submission is recorded and can be replayed at the URL /replays/[session-id]. \
**Survey Integration**: Before and after the writing task, users complete a survey to provide more background on themselves [WIP].\
**Data Analysis**: The repository includes scripts and notebooks for analyzing the collected data, focusing on how users responded to different politeness strategies [WIP]. 

## Project Structure
`ai-writing/`: Contains the code for the interactive writing tool. \
`notebook/`: Includes scripts for various AI prompting experiments. \
`analysis/`: Includes scripts and Jupyter notebooks for analyzing the data [WIP].

## How to Run
1. Install dependencies \
Inside the ai-writing directory, install all necessary dependencies by running
`pip install -r requirements.txt`
2. Add API key \
Create a file `/ai-writing/.env` and add a variable `OPENAI_API_KEY`.
3. Run the server on your local machine \
Run the following command in the ai-writing directory. \
`npm run dev`

App is deployed here: https://ai-writing-45138-5a0c8.web.app/.
