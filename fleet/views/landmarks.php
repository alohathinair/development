<div id="conditional-header">

    <form method="post" enctype="multipart/form-data">

        <div id="landmarks-controls">
            <button id="add_landmark">Add New Landmark</button>
            <button id="import-landmark">Import Landmarks</button>
        </div>

        <div id="import-landmarks-controls" style="display:none">
            Choose File: <input type="file" name="file">
            <button id="import-landmark-ok">OK</button>
            <button id="import-landmark-cancel">Cancel</button>

            <a href="/static/LandmarksImportTemplate.csv">Download Template</a>
        </div>

        
    </form>    
</div>


<?php $this->render_component_partial("landmarks", "landmark_list"); ?>


<?php $this->render_component_partial("landmarks", "landmark_management_dialogs"); ?>
