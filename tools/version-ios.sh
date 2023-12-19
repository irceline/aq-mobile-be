#!/usr/bin/env bash
HTTP_RESPONSE=$(curl --silent --request POST \
    --url https://us-central1-nebulae-1550056462163.cloudfunctions.net/bumpVersions \
    --header 'Content-Type: application/json' \
    --data '{
    "data": {
      "projectId": "belair-capacitor-ios",
      "type": "Patch"
    }
  }')

HTTP_BODY=$(echo $HTTP_RESPONSE | sed -e 's/HTTPSTATUS\:.*//g')
VERSION=$(echo $HTTP_BODY \
  | python -m json.tool \
  | grep Version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

PACKAGE_VERSION=$(echo $VERSION)
BUILD_NUMBER=""

VERSION_ARRAY=($(echo $VERSION | tr '.' "\n"))

for index in "${!VERSION_ARRAY[@]}"
do
    if [ "$index" == "2" ]
    then
        TEMP=`printf %05d ${VERSION_ARRAY[index]}`
    else
        TEMP=`printf %02d ${VERSION_ARRAY[index]}`
    fi

    BUILD_NUMBER+="$TEMP"
done

echo $PACKAGE_VERSION
