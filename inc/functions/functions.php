<?php

    function currentlyPage() {
        $serverName = basename($_SERVER['PHP_SELF']);
        $pageName = str_replace(".php", "", $serverName);

        return $pageName;
    }


