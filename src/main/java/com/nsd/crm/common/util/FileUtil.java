package com.nsd.crm.common.util;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.write.*;
import jxl.write.Number;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;
import java.util.Random;

/**
 * Created by gaoqiang on 23/1/2015.
 */
public class FileUtil {

    private final static Logger LOGGER = LoggerFactory.getLogger(FileUtil.class);

    public static byte[] convertInputStreamToByte(InputStream inputStream) {

        ByteArrayOutputStream out = null;
        try {
            out = new ByteArrayOutputStream(1024);
            byte[] temp = new byte[1024];
            int size;
            while ((size = inputStream.read(temp)) != -1) {
                out.write(temp, 0, size);
            }
            return out.toByteArray();
        } catch (IOException e) {
            LOGGER.error("IOException in FileUtil.convertInputStreamToByte(InputStream)", e);
        } finally {
            try {
                if (inputStream != null) {
                    inputStream.close();
                }
            } catch (IOException e) {
                LOGGER.error("IOException 2 in FileUtil.convertInputStreamToByte(InputStream)", e);
            }
            try {
                if (out != null) {
                    out.close();
                }
            } catch (IOException e) {
                LOGGER.error("IOException 3 in FileUtil.convertInputStreamToByte(InputStream)", e);
            }
        }
        return new byte[0];
    }


    public static void main(String[] args) throws Exception {
        WritableWorkbook wworkbook = null;
        File file = new File("D:\\myapp\\output1.xls");
        if(file.exists()){
            //file.delete();
        }
        WorkbookSettings wbSettings = new WorkbookSettings();

        wbSettings.setLocale(new Locale("cn", "CN"));
        wworkbook = Workbook.createWorkbook(file,wbSettings);
        WritableSheet wsheet = wworkbook.createSheet("First Sheet", 0);
        Label label = new Label(5, 2, "2013-12-12");
        wsheet.addCell(label);
        for(int i=0; i<5; i++){
            int intt = new Random().nextInt(10);
            Label ls1 = new Label(0, i, "AA_"+intt);
            Number num = new Number(1, i, intt);
            wsheet.addCell(ls1);
            wsheet.addCell(num);
        }

        wsheet.addCell(new Label(0, 6, "总和"));
        StringBuffer buf = new StringBuffer();
        buf.append("SUM(B1:B5)");
        Formula f = new Formula(1, 6, buf.toString());
        wsheet.addCell(f);

        Number number = new Number(3,4,3.1459);
        wsheet.addCell(number);


        wworkbook.write();
        wworkbook.close();

        Workbook workbook = Workbook.getWorkbook(new File("D:\\myapp\\output1.xls"));
        Sheet sheet = workbook.getSheet(0);
        Cell cell1 = sheet.getCell(0, 2);
        System.out.println(cell1.getContents());
        Cell cell2 = sheet.getCell(3, 4);
        System.out.println(cell2.getContents());
        workbook.close();
    }
}
