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

    echo "UPDATE movies SET rating = '$rate' WHERE id = '$tconst';" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;
    echo "$tconst's rating imported"

done < title.ratings.tsv;
