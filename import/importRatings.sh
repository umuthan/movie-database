#!/bin/bash

IFS='	'
while read tconst	averageRating numVotes
  do
    if [[ $averageRating =~ ^[+-]?[0-9]*\.[0-9]+$ ]]
    then
      rate=$averageRating
    else
      rate='0'
    fi

    echo "UPDATE movies SET rating = '$rate' WHERE id = '$tconst';"

done < title.ratings.tsv | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;
