#!/bin/bash

echo "TRUNCATE TABLE categories" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;

echo "SELECT DISTINCT categories from movies" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log >> categories.tsv;

IFS=','
while read c1 c2 c3
  do

    if [[ $c1 ]]
    then
      result=`echo "SELECT * FROM categories WHERE category = '$c1';" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;`
      if [[ $result ]]
      then
        echo "$c1 Category exists";
      else
        echo "INSERT INTO categories (category) VALUES ('$c1');" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;
      fi
    fi

    if [[ $c2 ]]
    then
      result=`echo "SELECT * FROM categories WHERE category = '$c2';" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;`
      if [[ $result ]]
      then
        echo "$c2 Category exists";
      else
        echo "INSERT INTO categories (category) VALUES ('$c2');" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;
      fi
    fi

    if [[ $c3 ]]
    then
      result=`echo "SELECT * FROM categories WHERE category = '$c3';" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;`
      if [[ $result ]]
      then
        echo "$c3 Category exists";
      else
        echo "INSERT INTO categories (category) VALUES ('$c3');" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;
      fi
    fi

done < categories.tsv;

echo "DELETE FROM categories WHERE category='genres'" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;
echo "DELETE FROM categories WHERE category='categories'" | mysql -u $DBUSER -p$DBPASS $DBNAME 2> mysql.log;

echo "Categories imported!"
