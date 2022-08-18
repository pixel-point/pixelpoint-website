#!/bin/bash
ffmpeg -i $1 -ss 00:00:01.000 -vf "scale=iw*sar:ih,setsar=1" -vframes 1 $2