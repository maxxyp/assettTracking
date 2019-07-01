<h1>HEMA</h1>

<p>This repository contains source, build and test scripts for HEMA.</p>

<h3>Prerequisites</h3>

<ul>
<li>npm install -g gulp</li>
</ul>

<h3>Install all the dependencies</h3>

<ul>
<li>npm install</li>
</ul>

<h3>Building the application</h3>
<ul>
<li>gulp build</li>
</ul>

<h3>Unit Tests</h3>
<ul>
    <li>gulp unit</li>
</ul>

<h3>Code Coverage</h3>
<ul>
    <li>gulp coverage - the output will produce a report in the coverage folder</li>
</ul>

<h3>Web Packaging</h3>
<p>There are many variants for packaging local/dev/test/demo/prod which use the configurations from the configurations folder. The output will bre created in the packaged folder.</p>
<ul>
    <li>gulp package --build-type=[local|dev|test|demo|prod]</li>
</ul>


<h3>Windows Universal Applications</h3>
<p>If you have generated the windows universal app solutions you should have HEMA.develop.sln and HEMA.packaged.sln</p>
<br/>
<p>The HEMA.develop.sln runs based on the wwwsrc folder, any changes made to the .ts and .html file will be included when you run the app. You must always run gulp build as least once to generate the index.html and compile andy sass files.</p>
<br/>
<p>The HEMA.packaged.sln runs based on the www folder and only includes the files. If the www folder does does exist you must run the package command in the following form:</p>
<br/>
<p>gulp package --build-type=[local|dev|test|demo|prod] --platformType=wua</p>
<br/>
<p>As the www folder is reused by the packaged project you must run the gulp package with the correct build-type to generate different deployable versions.</p>
