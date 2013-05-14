var ejs = require('ejs'),
    fs = require('fs'),
    dox = require("dox"),
    path = require("path"),
    wrench = require("wrench"),
    program = require('commander');

/**
 * Run docjs via its Node.js-API. Example:
 *
 *     #!/usr/bin/env node
 *     var docjs = require('docjs');
 *     docjs.run(['src/file.js'], 'doc/index.html', 'template.ejs');
 *
 * @function
 * @param {Array} source JavaScript files to parse.
 * @param {String} dest Destination HTML file. Example: "index.html".
 * @param {String} templatePath Template file to use. Example: "template.ejs"
 */
exports.run = function(source,dest,templatePath){

    var re = /(?:\.([^.]+))?$/;
    var engine = re.exec(templatePath)[1];

    //var filenames = wrench.readdirSyncRecursive(source);
    var filenames = source;

    // Get template
    var file = fs.readFileSync(templatePath, 'ascii');

    // Parse javascript & comments
    var allComments = [];
    for(var i=0; i<filenames.length; i++){
        if(filenames[i].match(/.js$/)){
            var f = filenames[i];
            console.log("Parsing "+f+"");
            var jsfile = fs.readFileSync(f, 'ascii');
            var comments = dox.parseComments(jsfile);
            // Add "file" property
            for(var j=0; j<comments.length; j++){
                comments[j].file = f;
            }
            allComments = allComments.concat(comments);
        }
    }

    // Render using the selected rendering engine
    var rendered;
    switch(engine){
        case "ejs":
            rendered = ejs.render(file, {
                locals: {
                    comments : allComments,
                    getCommentsByTag : getCommentsByTag,
                    filterTags : filterTags
                }
            });
            break;
        default:
            console.error("Rendering engine '"+engine+"' not supported yet.");
            break;
    }

    // Save index file
    fs.writeFileSync(dest,rendered);
    console.log("Wrote '"+dest+"'.");
};

/**
 * Filters <code>comments</code>. Only comments with at least one tag matching the <code>filter</code> will be returned.
 *
 *     var functionComments = getCommentsByTag(comments,{ type: "function" });
 * 
 * Note that this function only is available in the templating engine.
 * @function
 * @param {Array} comments The comments to filter.
 * @param {Object} filter A filter object. All key/value pairs in it will be used to match against tags.
 */
exports.getCommentsByTag = getCommentsByTag;
function getCommentsByTag(comments,filter){
    var result = [];
    for(var i=0; i<comments.length; i++){
        var d=comments[i],
            ctx=d.ctx,
            tags=d.tags,
            ok = false;
        for(var j=0; j<tags.length; j++){
            for(var key in filter){
                if(tags[j][key] == filter[key]){
                    ok = true;
                    break;
                }
            }
            if(!ok) break;
        }
        if(ok && tags.length){
            result.push(d);
        }
    }
    return result;
}

/**
 * Filters <code>tags</code> and returns the filtered array. Only tags matching the <code>filter</code> will be included in the result.
 * 
 * Example:
 *
 *     var paramTags = filterTags(comments[0].tags,{ type : "param" });
 *
 * Note that this function only is available in the templating engine.
 *
 * @function
 * @param {Array} tags An array of tags to filter.
 * @param {Object} filter A filter to apply. All key/value pairs must match against a tag for it to be accepted.
 */
exports.filterTags = filterTags;
function filterTags(tags,filter){
    var result = [];
    for(var i=0; i<tags.length; i++){
        var t=tags[i];
        var ok = true;
        for(var key in filter){
            if(t[key] != filter[key]){
                ok = false;
                break;
            }
        }
        if(ok) result.push(t);
    }
    return result;
}