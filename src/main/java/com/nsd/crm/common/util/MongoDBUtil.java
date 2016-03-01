package com.nsd.crm.common.util;

import com.mongodb.*;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Pattern;

public class MongoDBUtil
{	
	private static Logger logger = LoggerFactory.getLogger(MongoDBUtil.class);
	private static final String KEY_NAME = "key";
	private static final String VALUE_NAME = "value";
	private static final String TS_NAME = "ts";
	private static MongoDBUtil mongoDBUtil = null;
	private static Object lockObject = new Object();

	private String mongoDBServerIP = null;
	private String mongoDBServerPort = null;

	private static String MONGODB_SERVER_IP = "mongo.host";
	private static String MONGODB_SERVER_PORT = "mongo.port";
	private static String MONGODB_KEY = "mongo.database";
	private static String MONGODB_COLL_KEY = "mongo.collection";
	private String mongoDB = null;
	private String mongoDBColl = null;

	private static MongoClient mongo = null;

	/**
	 * 单例防止连接过多
	 * 
	 * @return
	 */
	public static MongoDBUtil getCollectionInstance(String databaseKey, String collectionKey)
	{
		MONGODB_KEY = databaseKey;
		MONGODB_COLL_KEY = collectionKey;
		if (mongoDBUtil == null)
		{
			synchronized (lockObject)
			{
				if (mongoDBUtil == null)
				{
					mongoDBUtil = new MongoDBUtil();
				}
			}
		}
		return mongoDBUtil;
	}

	private MongoDBUtil()
	{

		mongoDBServerIP = PropertiesUtil.getProperty(MONGODB_SERVER_IP);
		mongoDBServerPort = PropertiesUtil.getProperty(MONGODB_SERVER_PORT);
		mongoDB = PropertiesUtil.getProperty(MONGODB_KEY);
		mongoDBColl = PropertiesUtil.getProperty(MONGODB_COLL_KEY);
		try
		{
			mongo = new MongoClient(mongoDBServerIP, Integer.parseInt(mongoDBServerPort));
		}
		catch(UnknownHostException e)
		{
			logger.error("IP address of a host could not be determined.");
			e.printStackTrace();
		}
	}

	/**
	 * 更新数据（先删除原有内容，再插入最新的内容）
	 * @param key 待更新的key值
	 * @param value 待更新的内容
	 */
	public void updateData(String key, String value)
	{
		DB db = mongo.getDB(mongoDB);
		DBCollection dcoll = db.getCollection(mongoDBColl);
		long ts = System.currentTimeMillis();
		deleteKV(key);
		DBObject updateValue = new BasicDBObject();
		updateValue.put(KEY_NAME, key);
		updateValue.put(VALUE_NAME, value);
		updateValue.put(TS_NAME, ts);
		try
		{
			dcoll.insert(updateValue);
		}
		catch(Exception e)
		{
			logger.error("插入失败，请检查IP/Port，并重试连接！");
			e.printStackTrace();
		}
	}

	/**
	 * 根据KEY值插入一条记录
	 * @param key 待更新的key值
	 * @param value 待更新的内容
	 */
	public void insertData(String key, String value)
	{
		DB db = mongo.getDB(mongoDB);
		DBCollection dcoll = db.getCollection(mongoDBColl);
		long ts = System.currentTimeMillis();
		BasicDBObject doc = new BasicDBObject();
		doc.put(KEY_NAME, key);
		doc.put(VALUE_NAME, value);
		doc.put(TS_NAME, String.valueOf(ts));
		try
		{
			dcoll.insert(doc);
		}
		catch(Exception e)
		{
			logger.error("插入失败，请检查IP/Port，并重试连接！");
			e.printStackTrace();
		}
	}

	/**
	 * 根据指定条件查询数据
	 * @param content 查询条件
	 * @return 指定条件的返回结果集
	 */
	public List<HashMap<String, String>> findLikeDocs(String content)
	{
		List<HashMap<String, String>> result = new ArrayList<HashMap<String, String>>();
		DB db = mongo.getDB(mongoDB);
		DBCollection dbCollection = db.getCollection(mongoDBColl);
		//不区分大小写
		Pattern pattern = Pattern.compile(content, Pattern.CASE_INSENSITIVE);
		BasicDBObject query = new BasicDBObject();
		query.put(VALUE_NAME, pattern);

		DBCursor cur = dbCollection.find(query);
		while (cur.hasNext())
		{
			DBObject kvPair = cur.next();
			HashMap<String, String> kvHashMap = new HashMap<String, String>();
			String key = (String) kvPair.get(KEY_NAME);
			String value = (String) kvPair.get(VALUE_NAME);
			kvHashMap.put("key", key);
			kvHashMap.put("value", value);
			result.add(kvHashMap);
		}
		cur.close();
		return result;
	}

	/**
	 * 根据给定的key值返回对应的VALUE
	 * @param key 待查询的KEY值
	 * @return 指定KEY对应的VALUE
	 */
	public String find(String key)
	{
		DB db = mongo.getDB(mongoDB);
		DBCollection dcoll = db.getCollection(mongoDBColl);
		String value = null;
		BasicDBObject query = new BasicDBObject();
		query.put(KEY_NAME, key);
		try
		{
			DBCursor cur = dcoll.find(query);
			int resultNum = cur.count();
			if (resultNum == 0)
			{
				logger.debug("MongoDB中未找到key:" + key + "对应的value");
			}
			else if (resultNum == 1)
			{
				if (cur.hasNext() == true)
				{
					DBObject result = cur.next();
					value = (String) result.get(VALUE_NAME);
				}
				else
				{
					logger.warn("Oops!cur.hasNext() is false");
				}
			}
			else
			{
				logger.info("MongoDB中找到" + resultNum + "条key：" + key + "对应的value");
				ArrayList<String> values = new ArrayList<String>();
				while (cur.hasNext())
				{
					DBObject result = cur.next();
					String eachValue = (String) result.get(VALUE_NAME);
					if (!values.contains(eachValue))
					{
						values.add(eachValue);
					}
				}
				if (values.size() != 1)
				{
					logger.error("同一个key对应多个value,value:" + values);
				}
				else
				{
					value = values.get(0);
				}
			}
			cur.close();
		}

		catch(Exception e)
		{
			logger.error("查找失败，请检查连接是否正常！");
		}
		return value;
	}

	/**
	 * 根据给定的key值返回对应结果
	 * @param key 待查询的KEY值
	 * @return 指定KEY对应的结果（含key,value,ts）
	 */
	public HashMap<String, String> findDoc(String key)
	{
		DB db = mongo.getDB(mongoDB);
		DBCollection dcoll = db.getCollection(mongoDBColl);
		HashMap<String, String> hs = new HashMap<String, String>();
		BasicDBObject query = new BasicDBObject();
		query.put(KEY_NAME, key);
		try
		{
			DBCursor cur = dcoll.find(query);
			if (cur.count() == 0)
			{
				logger.warn("没有找到相应的数据");
			}
			else
			{
				DBObject result = cur.next();
				hs.put(KEY_NAME, result.get(KEY_NAME).toString());
				hs.put(VALUE_NAME, result.get(VALUE_NAME).toString());
				hs.put(TS_NAME, result.get(TS_NAME).toString());
			}
			cur.close();
		}
		catch(Exception e)
		{
			logger.error("查找失败，请检查连接是否正常！");
			e.printStackTrace();
		}
		return hs;
	}

	/**
	 * 删除集合
	 */
	public void dropCollection()
	{
		DB db = mongo.getDB(mongoDB);
		DBCollection dcoll = db.getCollection(mongoDBColl);
		dcoll.drop();
		logger.info("删除collection成功");
	}

	/**
	 * 删除指定集合所有的内容
	 */
	public void cleanCollection()
	{
		DB db = mongo.getDB(mongoDB);
		DBCollection dcoll = db.getCollection(mongoDBColl);
		BasicDBObject findAllData = new BasicDBObject();
		try
		{
			dcoll.remove(findAllData);
		}
		catch(Exception e)
		{
			logger.error("清除数据失败，请检查连接是否正常！");
			e.printStackTrace();
		}
	}

	/**
	 * 根据指定KEY值删除对应集合中的内容
	 * @param key
	 */
	public void deleteKV(String key)
	{
		DB db = mongo.getDB(mongoDB);
		DBCollection dcoll = db.getCollection(mongoDBColl);
		BasicDBObject query = new BasicDBObject();
		query.put(KEY_NAME, key);
		try
		{
			dcoll.remove(query);
			logger.debug("删除Key:" + key + "的数据成功");
		}
		catch(Exception e)
		{
			logger.error("清除数据失败，请检查连接是否正常！");
			e.printStackTrace();
		}
	}

	/**
	 * 删除规定时间的数据
	 * @param hours 时间
	 */
	public void deleteByTime(int hours)
	{
		DB db = mongo.getDB(mongoDB);
		DBCollection dcoll = db.getCollection(mongoDBColl);
		long currentTime = System.currentTimeMillis();
		// TODO:保存几个小时的数据由用户自定义,暂定一小时
		long borderTime = currentTime - 3600000 * hours;
		BasicDBObject query = new BasicDBObject();
		query.put(TS_NAME, new BasicDBObject("$gte", 0).append("$lte", borderTime));
		try
		{
			dcoll.remove(query);
			logger.info("删除规定时间的数据成功");
		}
		catch(Exception e)
		{
			logger.error("清除数据失败，请检查连接是否正常！");
			e.printStackTrace();
		}
	}

	/**
	 * 创建索引
	 * @param indexField 索引名
	 */
	public void indexForBuffer(String indexField)
	{
		DB db = mongo.getDB(mongoDB);
		DBCollection dcoll = db.getCollection(mongoDBColl);
		BasicDBObject index = new BasicDBObject(indexField, 1);
		try
		{
			dcoll.createIndex(index);
		}
		catch(Exception e)
		{
			logger.error("mongodb操作失败，请检查连接是否正常！");
			e.printStackTrace();
		}
	}


	/**
	 * 根据索引名删除索引
	 * @param name 索引名
	 */
	public void deleteIndex(String name)
	{
		DB db = mongo.getDB(mongoDB);
		DBCollection dcoll = db.getCollection(mongoDBColl);
		try
		{
			dcoll.dropIndex(name);
		}
		catch(Exception e)
		{
			logger.error("mongodb操作失败，请检查连接是否正常！");
			e.printStackTrace();
		}
	}

    public void putFile(String key,String bucket, byte[] data) {
        GridFSInputFile inputFile = new GridFS(mongo.getDB(mongoDB),bucket).createFile(data);
        inputFile.put(KEY_NAME, key);
        inputFile.save();
    }

    public byte[] getFile(String key,String bucket) throws IOException {
        List<GridFSDBFile> fsdbFiles = new GridFS(mongo.getDB(mongoDB),bucket).find(new BasicDBObject(KEY_NAME, key));
        if (fsdbFiles == null || fsdbFiles.size() == 0) return null;
        InputStream in = fsdbFiles.get(0).getInputStream();
        return toByteArray(fsdbFiles.get(0));
    }

    /**
     * convert gridFSDBFile to byte array .
     * @param file
     * @return byte[]
     * @throws java.io.IOException
     */
    private byte[] toByteArray(GridFSDBFile file) throws IOException {
        InputStream is = file.getInputStream();
        int len = (int)file.getLength();
        int pos = 0;
        byte[] b = new byte[len];
        while (len > 0) {
            int read = is.read(b, pos, len);
            pos += read;
            len -= read;
        }
        return b;
    }

	public static void main(String[] args){
		MongoDBUtil mongoDB = MongoDBUtil.getCollectionInstance("mongo.database","mongo.collection");
		mongoDB.insertData("test_name","name_1");
		System.out.println(mongoDB.find("test_name"));
		mongoDB.updateData("test_name", "name_1_updated");
		System.out.println(mongoDB.find("test_name"));
		mongoDB.deleteKV("test_name");
		System.out.println(mongoDB.find("test_name"));
	}
}
