#!/bin/bash

echo "TRUNCATE TABLE movies" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;

IFS='	'
while read tconst	titleType	primaryTitle originalTitle isAdult startYear endYear runtimeMinutes genres
  do
    if [[ $endYear =~ ^-?[0-9]+$ ]]
    then
      year=$endYear
    else
      if [[ $startYear =~ ^-?[0-9]+$ ]]
      then
        year=$startYear
      else
        year='0000'
      fi
    fi

    if [[ $runtimeMinutes =~ ^-?[0-9]+$ ]]
    then
      runtime=$runtimeMinutes
    else
      runtime='0'
    fi

    if [[ $genres == 'N' ]]
    then
      genre=''
    else
      genre=$genres
    fi

    echo "INSERT INTO movies (id, title, year, runTime, categories) VALUES ('$tconst', '${primaryTitle//"'"/''}', '$year', '$runtime', '$genre');"

done < title.basics.tsv | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;

echo "DELETE FROM movies WHERE id='tconst'" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;
