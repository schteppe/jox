# jox
```jox``` maps comments in your source to custom HTML. The comments are written using JSDoc-style tags and Markdown syntax, and the HTML is rendered using your own EJS or Jade templates. This makes it possible to make super-customized documentation for your code.

### Install
```
npm install jox -g
```

### Usage
#### 1. Document your code
Example:
```javascript
/**
 * Computes the sum of two numbers.
 * @function
 * @param {number} a
 * @param {number} b
 * @return {number} The sum.
 */
function add(a,b) {
    return a+b;
}
```
Say you save this file as ```src/add.js```.

#### 2. Create an .ejs or .jade template
```
<!DOCTYPE html>
<html>
<body>
    <h1>My first jox template</h1>
    <%
    for(var i=0; i<comments.length; i++){
        var c = comments[i]; %>
        <h2><%=c.ctx.name%></h2>
        <%-c.description.full%>
        <%
    }
    %>
</body>
</html>
```
For more information on how to write EJS templates, visit http://embeddedjs.com/. You can also use [Jade](http://jade-lang.com/).

In the template you have access to the ```comments``` array produced by [dox](https://github.com/visionmedia/dox), as well as a few nifty functions provided by jox. For more information about what information the ```comments``` contains, visit the [dox github page](https://github.com/visionmedia/dox).

Let's say you save the above file in your project folder as ```doc/template.ejs```.

#### 3. Create a file ```.jox``` in the root of your project folder
Example:
```javascript
{
    "source"      : ["src/add.js"],
    "template"    : "doc/template.ejs",
    "destination" : "doc/index.html"
}
```
This instructs ```jox``` scan the JavaScript file of yours, use the template ```doc/template.ejs``` and produce a HTML file ```doc/index.html```.

#### 4. Run jox
```
jox
```
Done! Now you can view ```doc/index.html``` in a web browser. It will look something like this:
```html
<!DOCTYPE html>
<html>
<body>
    <h1>My first template</h1>
    <h2>add</h2>
    <p>Computes the sum of two numbers.</p>
</body>
</html>
```

Note: if you need external files for your HTML (css, javascript, images, etc.), you need to add them manually. In this case, they could have been placed in ```doc/```.

### Local variables in the template

#### comments : Array
The comments generated by [dox](https://github.com/visionmedia/dox). They are parsed from all files, one at a time, and concatenated in this ```comments``` array. jox adds a "file" property to each comment so you know where it was parsed.
```javascript
[
  {
    "tags": [{ "type": "method", ... }, ... ],
    "description": { "full": "<p>some html</p>", ... },
    "code": "...",
    "ctx": { "type": "method", ... },
    "file":"src/filename.js"
  },
  ...
]
```
The other nifty things available inside the templates are described in the [sample documentation](doc/index.html).

### License
The MIT License (MIT)

Copyright (c) 2013 jox authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
