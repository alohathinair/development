<?php
$u = TAWUser::singleton();
if ($u->accessLevel == ACCESS_LEVEL_ADMINISTRATOR) { 
    echo '<input type="hidden" value=1 id="all-divisions"/>';
}

?>
<div id="reports-container">

    <form id="post-report" action="/ajax.php" method="POST" target="report-results-iframe">

        <input type="hidden" id="report-id" name="report-id" value="<?php echo $_REQUEST["report"]; ?>">


        <div id="reports-configure">
            <table width="95%">
                <tr>
                    <td width="78%">

                        <div id="reports-input" class="reports-panel">
                            <fieldset>
                                <label class="report-param-name">Choose a Report:</label>
                                <div>
                                    <select id="select-report">
                                        <option value="0">Select a Report...</option>
                                      <?php
                                        $reports = $this->get_reports();
                                        foreach ($reports as $report) {

                                            $selected = $this->report_type == $report->get_id() ? " selected " : "";
                                            if ($selected)
                                                $reportTitle = $report->get_name();

                                            echo "<option value='".$report->get_id() ."' " . $selected. ">".$report->get_name()."</option>";
                                        }
                                      ?>
                                    </select>
                                </div>
                                <div class="clear"></div>
                            </fieldset>
                            <div class="clear"></div>


                            <div id="reports-criteria">
                                <input type="hidden" name="report-render" id="report-render" value="html" />
                                <input type="hidden" name="printer-friendly" id="printer-friendly" value="0" />
                                <input type="hidden" name="page-number" id="page-number" value="1" />

                                <?php
                                  
                                    $this->render_component_partial("reports", $this->report_type . "_report_criteria");
                                 ?>

                                <div class="clear"></div>

                                <div id="reports-error" class="errors-wrapper">
                                    <ol id="reports-error-list"></ol>
                                </div>

                                <div id="reports-paginate"></div>

                                <div id="run-report-container">
                                    <input type="button" name="run-report" id="run-report" value="Run Report" />
                                </div>
                                
                            </div>


                        </div>
                    </td>
                    <td valign="bottom" width="22%" id="reports-export-col">

                        <div id="reports-export">
                         
                            <a href="#" class="export-button" id="export-pdf" title="Export to PDF"><img alt="Export to PDF" src="/images/icon_export_pdf.gif"></a>
                            <a href="#" class="export-button" id="export-word" title="Export to Word"><img alt="Export to Word" src="/images/icon_export_word.gif"></a>
                            <a href="#" class="export-button" id="export-excel" title="Export to Excel"><img alt="Export to Excel" src="/images/icon_export_excel.gif"></a>
                            <a href="#" class="export-button" id="print" title="Print"><img alt="Print" src="/images/icon_print_off.gif"></a>

                            <input type="submit" name="schedule" id="schedule" value=" Schedule ">

                        </div>

                    </td>
                </tr>
            </table>


        </div>


        <div class="clear"></div>

        <input type="hidden" id="report-title" name="report-title" value="<?php echo $reportTitle; ?>">

    </form>

    <!--
    <br/><br/>

    <div id="reports-output-title">
        Report: Stop and Idle Time
    </div>

    <div id="reports-output-panel">
        <table class="reports-table">
            <tr>
                <td class="name">Report Run Data/Time</td>
                <td class="value">07/28/2010 04:53 PM</td>
            </tr>

            <tr>
                <td class="name">Report Time Period</td>
                <td class="value">07/28/2010 04:53 PM</td>
            </tr>

        </table>

    </div>
!-->

    <iframe name="report-results-iframe" id="report-results-iframe"></iframe>
    <div id="report-output"></div>
</div>