#!/bin/bash

#
# Copyright 2017 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

source ../target/scripts/common.sh

$SLIDER version

$SLIDER create $CLUSTER_NAME \
	--appdef $ACCUMULO_PKG \
	--addon Gaffer $GAFFER_PKG \
	--template $ACCUMULO_APPCONFIG \
	--resources $ACCUMULO_RESOURCES \
	--debug
