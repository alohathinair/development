#!/bin/sh

find . | grep php | xargs chmod 775
find . | grep css | xargs chmod 775
find . | grep js | xargs chmod 775
find . | grep gif | xargs chmod 775
find . | grep png | xargs chmod 775
find . | grep jpg | xargs chmod 775

