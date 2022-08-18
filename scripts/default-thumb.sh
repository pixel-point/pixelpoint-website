#!/bin/bash
ffmpeg -i $1 -ss 00:00:00.000 -vframes 1 $2