## TITLE
##### The United States of Drugs

- Authors
	- Christian Kardish
	- Benjamin Molin
	- Jack Stone

## SUBMISSION
We have submitted a zip file with two files
1. Project Files Folder
	- All the code to render the live website
	- All the data to render the live website
	- README
2. Process Book PDF

## ABOUT
This was the final project for a Harvard Visualization class, CS171: Visualization. We used D3 to create a website

TF
	- Charlene Hwang

## LINKS
Live Website - https://jackstonedev.github.io/cs171-final-project/

Process book - https://docs.google.com/document/d/1dQqIP2BuFho94HvQORJIcJCAz79O230XJEafC6sDwVY/edit

GitHub - https://github.com/JackStoneDev/cs171-final-project

Screencast - 

## DATA
1. CDC Wonder Multiple Cause of Death (for all charts relating to deaths)
2. Bureau of Justice Statistics (for arrests by race category)
3. Substance Abuse and Mental Health Services Administration (for drug usage rates by race category)

## WALKTHROUGH
1. Hero

2. Intro Text

3. Interactive Visualization (choropleth + line chart)
	- This chart allows the user to select a state. When the user selects a state in the choropleth, the line chart will update to show that state, compared to another line showing the overdose rate by year for the national average. Additionally, the user can select different demographics that they want to filter the data by. When different demographics are selected, the line plots are filtered just to include those demographics.
	- SOURCE: CDC Wonder.

4. Comparing Demographics
	- This allows the user to subset the dataset to one demographic profile, and easily visualize how the overdose rates of that one profile compare to the national average across all profiles. 
	- SOURCE: CDC Wonder.

5. Drug Usage
	- This static visualization shows the illicit drug usage in the past month for people 12 years and older. 
	- SOURCE: Replicated from Figure 2.12. of SAMHSA (p 27).

6. Drug Arrests by Race Population
	- The line chart shows the number of arrests (% each year) of each demographic. If an event of interest in the timeline at the top is clicked, it will give a text blurb (from Wikipedia) about that event.
	- SOURCE: Bureau of Justice Statistics.

7. For Every 100 People Who Die from Overdoses...
	- This innovative visualization is a very easy to understand way to visualize who is effected the most (in total magnitude, not adjusting for different population sizes) by the drug epidemic
	- SOURCE: CDC Wonder. 


7. How can you do your part?
	- Links to resources to learn more about the drug epidemics

8. About

## NOTES
1. There is no mention of the hispanic population in any of the overdose charts. This is because the dataset does not have hispanic as a race, but just categorizes each datapoint as "hispanic" or "non-hispanic". We chose to exclude this category for simplicity.
