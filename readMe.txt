required:
1.Ctrl+ `;
2.npm install(may take long time about 15~30 mins);
3.npm start;

optional:
enable debug in vscode:

ref: https://stackoverflow.com/questions/42495655/how-to-debug-angular-with-vscode

Install the Chrome Debugger Extension
Create the launch.json (inside .vscode folder)
Use my launch.json (see below)
Create the tasks.json (inside .vscode folder)
Use my tasks.json (see below)
Press CTRL+SHIFT+B
Press F5

Attach
With "request": "attach", you must launch Chrome with remote debugging enabled in order for the extension to attach to it. Here's how to do that:

Windows

Right click the Chrome shortcut, and select properties
In the "target" field, append --remote-debugging-port=9222
Or in a command prompt, execute <path to chrome>/chrome.exe --remote-debugging-port=9222
macOS

In a terminal, execute /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
Linux

In a terminal, launch google-chrome --remote-debugging-port=9222

{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "port": 9222,      
      "url": "http://localhost:8080/",
      "webRoot": "${workspaceRoot}"
    },
    {
      "name": "Attach Chrome",
      "type": "chrome",
      "request": "attach",
      "port": 9222,
      "url": "http://localhost:8080/#",
      "webRoot": "${workspaceRoot}"
    },
    {
      "name": "Launch Chrome (Test)",
      "type": "chrome",
      "request": "launch",
      "port": 9222,      
      "url": "http://localhost:8080/debug.html",
      "webRoot": "${workspaceRoot}"
    },
    {
      "name": "Launch Chrome (E2E)",
      "type": "node",
      "request": "launch",  
      "program": "${workspaceRoot}/node_modules/protractor/bin/protractor",
      "protocol": "inspector",
      "args": ["${workspaceRoot}/protractor.conf.js"]
    }
  ]
}
tasks.json for angular/cli >= 1.3
{
    "version": "2.0.0",
    "tasks": [
      {
        "identifier": "ng serve",
        "type": "npm",
        "script": "start",
        "problemMatcher": [],
        "group": {
          "kind": "build",
          "isDefault": true
        }
      },
      {
        "identifier": "ng test",
        "type": "npm",
        "script": "test",
        "problemMatcher": [],
        "group": {
          "kind": "test",
          "isDefault": true
        }
      }
    ]
  }