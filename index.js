/*
 Copyright 2016 Michael F. Collins, III

 Liensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 Based on code from electron-mocha by JP Richardson:

 The MIT License (MIT)

 Copyright (c) 2016 JP Richardson

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISINGFROM, OUR OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const {app} = require('electron');

const Cucumber = require('cucumber');

process.on('uncaughtException', function(err) {
  console.error(err);
  console.error(err.stack);
  exit(1);
});

var browserDataPath = path.join(os.tmpdir(), 'electron-cucumber-' + Date.now().toString());
app.setPath('userData', browserDataPath);

app.on('ready', function() {
  var cli = Cucumber.Cli(process.argv);
  cli.run(function(succeeded) {
    var code = succeeded ? 0 : 1;
    function exitNow() {
      exit(code);
    }

    if (process.stdout.write('')) {
      exitNow();
    } else {
      process.stdout.on('drain', exitNow);
    }
  });
});

function exit(code) {
  fs.remove(browserDataPath, function(err) {
    if (err) {
      console.error(err);
    }
    
    app.exit(code);
  });
}