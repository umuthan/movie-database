#!/bin/bash

echo "Hello, What is your DB user?"
read DBUSER

echo "What is the password for $DBUSER?"
read DBPASS

echo "Write a DB Name for this project. (eg: moviedatabase)"
read DBNAME

export DBUSER
export DBPASS
export DBNAME

echo "----------------------------"
echo "Connecting to DB...";

result=`echo "SHOW DATABASES" | mysql -u $DBUSER -p$DBPASS 2> mysql.log;`

if [[ $result ]]
then
  echo "--------------------------"
  echo "Connected!"
  echo "--------------------------"
  echo "DB Creating..."
  result=`echo "CREATE DATABASE $DBNAME" | mysql -u $DBUSER -p$DBPASS 2> mysql.log;`
  if [[ $result ]]
  then
    echo "DB Not Created!"
    echo "Check mysql.log for more info"
    echo "--------------------------"
  else
    echo "DB Created!"
    echo "--------------------------"
    echo "Tables creating..."
    result=`mysql -u $DBUSER -p$DBPASS $DBNAME < tables.sql 2> mysql.log;`
    if [[ $result ]]
    then
      echo "--------------------------"
      echo "Error"
      echo "Check mysql.log for more info"
      echo "--------------------------"
    else
      echo "Tables created"
      echo "--------------------------"
      rm *.gz
      rm *.tsv
      wget https://datasets.imdbws.com/title.basics.tsv.gz
      gunzip title.basics.tsv.gz
      echo "Movies starting to import..."
      source ./importBasics.sh
      echo "--------------------------"
      wget https://datasets.imdbws.com/title.ratings.tsv.gz
      gunzip title.ratings.tsv.gz
      echo "Ratings starting to import..."
      source ./importRatings.sh
      echo "--------------------------"
      echo "Categories starting to import..."
      source ./importCategories.sh
      echo "--------------------------"
      echo "All Imports Completed!"
      rm *.tsv
      echo "--------------------------"
    fi
  fi
else
  echo "--------------------------"
  echo "Not Connected!"
  echo "Check mysql.log for more info"
  echo "--------------------------"
fi
