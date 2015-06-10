package org.test;

//import com.weimingfj.common.fps.FPSServer;

public class FpsTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String regtpl = "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";
		String vertpl = "AOj5AMgp43NcwEE381mKa/5cZ2Y2MRa/cZMReOnpokQ1/3IrBpKtFMWA1bjGivDc+HweOKGXiYCUnprTYa6Z0BZokcTouUNhTyrhQ1lnVMRsvPH6MGe/3QOYWSNDiVf83K0hIrNw+lHyqSKm69gS5/IBpE4KtOUYa7bfOai13D3DKt4KiZc5l4PEOJ6Kf7zitAcFMlUKH175uzboxfdtVnvwNueoWALk4smaxzlJ9rCrsgWABqshHej1b4GKQ5EUSDkn/+zMjUqhKaAayS8+jGY4TyE/kaN/jLK2NgN/OIFhPo7zZmhivATG9saOnoC1GrKNFOX6rmB8NaDd3EXlyyJE3eIM1YfwK51Wy8o9jOtsP7uhBm8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
		//AOg3Acgp43NcwEE381mKK9RcZ2ZDx3K9cZx3zuVlKNr068ooA76cLIkOuprvUVEVQNGzul0ygdmbVlEXe5eHy3wKNGExTbKH4Y+Hr0oL1BuFzSak76m68BOSDLeDqQjt8L9Poo2D0qBbzHBeVw3v67TA7fCwJZnSziDdVFx8SSe96c/WQTEAE4T2CQq9y5bG9z9LILSfZtkq7cnn6JoR3TWBdZdbkOLlrqcdditOhIuGfuXwPUFDfAGupGrxNKKKbvxy70a47lyHaecqc2yyrvbk0UEY0gV0fqJNOw9zmhI4/vvN6U5UV0KnVGoWNMJGHMl8OruSIOGyGp1da0MXObGGX001TQKQ8ImxA2DPcm3lW1utjgw+6uAlkCEKFo2ukCwR0zB66AqrBABSpp3EHzMcwva3j/ENv7Am+uzoLX5PO4DJjIvUIHUPEDZPt2yRIxPRbwAA
		try {
			//FPSServer server = new FPSServer();
			//boolean ok = server.JVerifyTemplateFromStr(regtpl,vertpl); //1:1模式

            //以下是1:N模式，数据库指纹数量多，不建议采用
            // int Crdb=server.JCreateCacheDB();//创建缓存
			// boolean isok = server.JAddTemplateStrToRam(regtpl, 1);//加载到内存，标示为1(可根据数据库的对应标示添加)
			// int uid = server.JVerifyTemplateOneToManyFromStr(vertpl);//验证指纹，返回标示1
            // int Frdb=server.JFreeCacheDB();//释放缓存

			//System.out.println("result:       "+ok);
			//System.out.println("result:       "+isok);
			//System.out.println("result:       "+uid);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}