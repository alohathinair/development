<div id="import-landmark-dialog" class="form-dialog">

    <div id="file-uploader">
        <noscript>
            <p>Please enable JavaScript to use file uploader.</p>
            <!-- or put a simple form for upload here -->
        </noscript>
    </div>

    <div id="import-landmarks-result">

        <div id="import-errors" style="display:none" class="alert-message">
            <a id="import-errors-close" class="close" href="#">x</a>
            <p>
                Error importing the folowing rows: <span id="import-row-errors"></span>
            </p>
        </div>

        <div id="import-landmarks-container" style="display: none">
            <table id="import-landmarks-table">
                <thead>
                            <tr>
                                    <th width="10%">#</th>
                                    <th width="30%">Name</th>
                                    <th width="40%">Address</th>
                                    <th width="20%">Location</th>
                            </tr>
                    </thead>
                    <tbody id="import-landmarks-list"></tbody>
            </table>

        </div>

    </div>



</div>

