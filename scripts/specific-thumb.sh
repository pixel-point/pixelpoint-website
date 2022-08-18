#!/bin/bash
ffmpeg -i $1 -ss 00:00:01.000 -vf scale=$3:$4 -vframes 1 $2