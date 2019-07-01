package com.assettracking.junit;


import com.assettracking.junit.Collect.collectItem;
import com.assettracking.junit.LocalVanStock.materials;
import com.assettracking.junit.Reserve.reserveItem;
import com.assettracking.junit.Search.searchMaterial;
import com.assettracking.junit.Cancel.cancelItem;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({
        materials.class,
        searchMaterial.class,
        reserveItem.class,
        cancelItem.class,
        collectItem.class
})
public class TestRunner {
}
