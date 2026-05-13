import sys
import os

file_path = r"d:\Projects\unisol\erp\crm\fe\crm-erp-fe\src\pages\modules\superAdmin\database\superAdminOrganizationDB\superAdminOrganizationTabs\BiomedicalAndSolidWaste.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

header = """import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import ConcernPersonForm from "./ConcernPersonForm";

const Select = ({"""

# Find the first mention of label, name, formik since Select might be missing
if 'label,' in content and 'name,' in content:
    idx = content.find('label,')
    # Prepend header and a bit of spacing
    # Assuming it was part of Select = ({ ...
    content = header + "\\n  " + content[idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("BiomedicalAndSolidWaste.jsx fixed")
