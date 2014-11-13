"character"
length("character")
#everything in R is a vector (or arrary)
c("character one", "character two")
letters
c(1, 2, 3) + c(4, 5, 6)
#will add the positions together.  + doesn't mean concoctenate but rather add the positions together

c(1, 2, 3) + 1
#and 
c(1,2,3) + c(1)
#do the same thing
c(1) == 1
#Why?? because 1 is already an array and 'c' is just combining arrays.
c(1,2,3) + c(1,2)
#goes through adds indexes 1 and 2 but index 3 doesn't exist so it starts at the beginning.  Called Vector Recycling.
c(1,2,3,4) + c(1,2)
#no warnign because the lengths are nicely divisable.

var <- c("UPPER", "MixED", "semILODE")
tolower(var)
#in javascript this wouldn't work because you'd have to use a loop.  Passing a function to a vector will repeat as many times as necessary because its vectorized.
library(dplyr)
mtcars %>%
  filter(mpg>20)
letters
letters[1:5]
#called subsetting or subscripting.  Some set of things and you want some set of smaller things.
letters[c(1,5,10)]
letters[-10]
#gives everything except the 10th letter
letters[c(-1:-10)]
#R STARTS WITH 1 NOT WITH 0 LIKE IN JAVASCRIPT
#data frame is multidimensional
mtcars[1]
mtcars[1:1]
1 gives just first 
mtcars[1,]
mtcars[,1]
mtcars [1:5,]
what_i_want <- 1:5
mtcars[what_i_want,]
mtcars$mpg


#logical subsetting

letters == "c"
vowels = c("a", "e", "i", "o", "u")
letters %in% vowels
letters[letters %in% vowels]
#the [] return only the values that are true.  Only return the values that are true.
mtcars[mtcars$mpg > 22,]
#base way of subscripting or filtering data
a> mtcars$mpg > 22
mtcars[a,]


coercion

c(1,"2")
#result will be all strings
c(FALSE, 3)
# >> 0, 3
c(FALSE, TRUE, 3)
## >> 0, 1, 3
c(FALSE, TRUE, 3, "string")
coercian goes up the chain. beginning with 


my_func <- function() {
  return (1)
}
my_func()


2+2
my_func(x,y)
`+`(2,2,)
`-`(2,1)
`+`
library(lubridate)
ymd("2014-01-01") - ymd("1776-01-01")
